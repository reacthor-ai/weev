export const STORAGE_PREFIX = {
  organization: {
    home: (id: string) => `org-${id}`,
    line: {
      fine_tune: {
        sparse_fine_tune_home: (fineTuneFolderId: string) => `LINE/fine-tune/sparse/folder-${fineTuneFolderId}`,
        sparse: (fineTuneFolderId: string, fineTuneId: string) =>
          `LINE/fine-tune/sparse/folder-${fineTuneFolderId}/trigger-process-${fineTuneId}.csv`,
        merged: (finetuneBucketId: string) =>
          `LINE/fine-tune/merged/merged-${finetuneBucketId}.jsonl`
      },
      rag: {
        sparse: (ragFolderId: string, ragId: string) => `LINE/rag/folder-${ragFolderId}/doc-${ragId}.pdf`
      }
    },
    ai: {
      open_ai: {
        folder: (id: string) => `${id}-messages.jsonl`
      }
    }
  }
}
