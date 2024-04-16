export const STORAGE_PREFIX = {
  organization: {
    home: (id: string) => `org-${id}`,
    line: {
      fine_tune: {
        sparse_fine_tune_home: (fineTuneFolderId: string) => `LINE/fine-tune/sparse/folder-${fineTuneFolderId}`,
        sparse: (fineTuneFolderId: string, fineTuneId: string) =>
          `LINE/fine-tune/sparse/folder-${fineTuneFolderId}/trigger-process-${fineTuneId}.csv`,
        merged: (mergedId: string) =>
          `LINE/fine-tune/merged/merged-${mergedId}.csv`
      },
      rag: {
        sparse: (ragFolderId: string, ragId: string) => `LINE/rag/folder-${ragFolderId}/doc-${ragId}.pdf`
      }
    }
  }
}
