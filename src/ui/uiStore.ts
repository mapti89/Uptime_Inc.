import { create } from 'zustand';
import type { Category, GameState, Provides } from '../game/types';

export type DesktopTab = 'infra' | 'upgrades' | 'research' | 'achievements' | 'stats' | 'prestige' | 'settings';
export type MobileView = 'salle' | 'infra' | 'upgrades' | 'research' | 'etat' | 'plus';

/** Ce qu'un raccourci demande de mettre en évidence dans la boutique. */
export interface ShopFocus {
  key: keyof Provides;
  /** Change à chaque raccourci, pour relancer le défilement et l'animation même sur la même cible. */
  nonce: number;
}

interface UiStore {
  desktopTab: DesktopTab;
  mobileView: MobileView;
  shopCat: Category;
  shopFocus: ShopFocus | null;
  setDesktopTab: (t: DesktopTab) => void;
  setMobileView: (v: MobileView) => void;
  setShopCat: (c: Category) => void;
  /** Raccourci : ouvre Infrastructure sur la catégorie et met en évidence ce qui fournit `key`. */
  goToShop: (cat: Category, key: keyof Provides) => void;
  clearShopFocus: (nonce: number) => void;
  /** Partie décodée en attente de confirmation avant de remplacer la partie en cours. */
  pendingImport: GameState | null;
  proposeImport: (s: GameState | null) => void;
  /** Menu d'aide ouvert. */
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  /** Fiche du tutoriel rouverte à la demande depuis l'aide : introduction ou nouveautés d'une ère. */
  tutoReplay: 'intro' | number | null;
  replayTuto: (what: 'intro' | number | null) => void;
}

let focusNonce = 0;

export const useUi = create<UiStore>((set) => ({
  desktopTab: 'infra',
  mobileView: 'salle',
  shopCat: 'servers',
  shopFocus: null,
  setDesktopTab: (desktopTab) => set({ desktopTab }),
  setMobileView: (mobileView) => set({ mobileView }),
  setShopCat: (shopCat) => set({ shopCat, shopFocus: null }),
  goToShop: (cat, key) =>
    set({ desktopTab: 'infra', mobileView: 'infra', shopCat: cat, shopFocus: { key, nonce: ++focusNonce } }),
  clearShopFocus: (nonce) => set((s) => (s.shopFocus?.nonce === nonce ? { shopFocus: null } : {})),
  pendingImport: null,
  proposeImport: (pendingImport) => set({ pendingImport }),
  helpOpen: false,
  setHelpOpen: (helpOpen) => set({ helpOpen }),
  tutoReplay: null,
  replayTuto: (tutoReplay) => set({ tutoReplay, helpOpen: false }),
}));
