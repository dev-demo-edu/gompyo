import { atom } from "jotai";

export const refreshPlanAtom = atom(false);

export interface Document {
  id: string;
  documentName: string;
  documentType: string;
  s3Url: string;
  uploadDate: string;
  relatedId: string;
  documentCategory: "contract" | "shipment";
}

interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  lastFetched: number;
}

const initialState: Record<string, DocumentState> = {};

export const documentsStateAtom =
  atom<Record<string, DocumentState>>(initialState);

export const getDocumentsAtom = atom(
  (get) => get(documentsStateAtom),
  (
    get,
    set,
    {
      cargoId,
      category,
      documents,
      isLoading,
    }: {
      cargoId: string;
      category: "contract" | "shipment";
      documents: Document[];
      isLoading: boolean;
    },
  ) => {
    const currentState = get(documentsStateAtom);
    const key = `${cargoId}-${category}`;

    set(documentsStateAtom, {
      ...currentState,
      [key]: {
        documents,
        isLoading,
        lastFetched: Date.now(),
      },
    });
  },
);

export const getCurrentDocuments = atom((get) => {
  const state = get(documentsStateAtom);
  return (cargoId: string, category: "contract" | "shipment") => {
    const key = `${cargoId}-${category}`;
    return state[key]?.documents || [];
  };
});

export const getIsLoading = atom((get) => {
  const state = get(documentsStateAtom);
  return (cargoId: string, category: "contract" | "shipment") => {
    const key = `${cargoId}-${category}`;
    return state[key]?.isLoading || false;
  };
});

// export const shouldFetchDocuments = atom((get) => {
//   const state = get(documentsStateAtom);
//   return (cargoId: string, category: "contract" | "shipment") => {
//     const key = `${cargoId}-${category}`;
//     const currentState = state[key];

//     // 상태가 없거나 마지막 fetch 이후 5분이 지났으면 fetch
//     if (
//       !currentState ||
//       Date.now() - currentState.lastFetched > 5 * 60 * 1000
//     ) {
//       return true;
//     }

//     return false;
//   };
// });
