import { getPortfolio } from '@/server/projects/queries';
import { allPlacements, findPlacement } from '@/lib/portfolio';

/** Route ids (/projects/<id>) of every published listing. */
export async function projectIds(): Promise<string[]> {
  return allPlacements(await getPortfolio()).map((p) => p.id);
}

export async function findProject(id: string) {
  const data = await getPortfolio();
  const placement = findPlacement(data, id);
  if (!placement) return undefined;
  return { id: placement.id, name: placement.title, description: placement.description || placement.subtitle };
}
