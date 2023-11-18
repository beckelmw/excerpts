import { globby } from "globby";

/**
 * Wrapper around globby
 * 
 * @param {string} [glob]
 * @example `getFiles('**\/*.md')`

 * @returns {Promise<string[]>}
 */
export default async (glob = "**/*") => {
  const paths = await globby([glob, "!node_modules"]);

  return paths.sort((a, b) => (a < b ? 1 : -1));
};
