import { project } from './project';
import { siteSettings } from './siteSettings';

/**
 * Deux types, pas plus : les projets, et le document unique de réglages. Le
 * squelette générique (service, page) a été retiré : il venait d'un autre
 * site et n'avait aucun rendu ici.
 */
export const schemaTypes = [project, siteSettings];

/** Types dont il ne doit exister qu'un seul document, ouvert directement par la structure. */
export const SINGLETON_TYPES = new Set<string>([siteSettings.name]);
