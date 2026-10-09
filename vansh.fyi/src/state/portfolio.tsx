'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { EMPTY_PORTFOLIO, type PortfolioData } from '../../lib/portfolio';

const PortfolioContext = createContext<PortfolioData>(EMPTY_PORTFOLIO);

/** Gives the client views the project data that a server component fetched. */
export function PortfolioProvider({ data, children }: { data: PortfolioData; children: ReactNode }) {
  return <PortfolioContext.Provider value={data}>{children}</PortfolioContext.Provider>;
}

/** Empty outside a provider (e.g. in unit tests), so callers must cope with no projects. */
export const usePortfolio = () => useContext(PortfolioContext);
