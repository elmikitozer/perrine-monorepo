/**
 * ffmpeg et ffprobe, partages par transcode-video.mjs et extract-loops.mjs.
 * Deux implementations auraient derive.
 */

import { spawn } from 'node:child_process';
import { basename } from 'node:path';

export function run(command, args) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    child.stdout.on('data', () => {});
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
      if (stderr.length > 40_000) stderr = stderr.slice(-40_000);
    });
    child.on('error', (error) =>
      rejectPromise(
        error.code === 'ENOENT'
          ? new Error(`${command} est introuvable. Sur macOS : brew install ${command}`)
          : error
      )
    );
    child.on('close', (code) =>
      code === 0
        ? resolvePromise()
        : rejectPromise(new Error(`${command} a echoue (code ${code})\n${stderr.trim()}`))
    );
  });
}

export function ffprobe(file) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,codec_name,pix_fmt,r_frame_rate',
      '-show_entries', 'format=duration',
      '-of', 'json',
      file,
    ]);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => (stdout += chunk));
    child.stderr.on('data', (chunk) => (stderr += chunk));
    child.on('error', rejectPromise);
    child.on('close', (code) => {
      if (code !== 0) return rejectPromise(new Error(`ffprobe a echoue sur ${basename(file)} : ${stderr.trim()}`));
      const parsed = JSON.parse(stdout);
      const stream = parsed.streams?.[0];
      if (!stream) return rejectPromise(new Error(`Aucune piste video dans ${basename(file)}`));
      resolvePromise({
        width: stream.width,
        height: stream.height,
        codec: stream.codec_name,
        pixelFormat: stream.pix_fmt,
        frameRate: stream.r_frame_rate,
        durationSeconds: Number(parsed.format?.duration ?? 0),
      });
    });
  });
}
