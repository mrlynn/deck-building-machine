'use client';

import { useRef, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import CheckIcon from '@mui/icons-material/Check';
import {
  buildShareUrl,
  downloadBrandPackJson,
  parseBrandPackFile,
} from '@/lib/brand-pack-io';
import { copyText } from '@/lib/copy-text';
import type { BrandPack } from '@/lib/types';

type Props = {
  brand: BrandPack;
  onImport: (brand: BrandPack) => void;
};

export function BrandPackShare({ brand, onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const canExport = Boolean(brand.customerName.trim());

  const btnSx = {
    borderRadius: 999,
    width: { xs: '100%', sm: 'auto' },
    justifyContent: { xs: 'flex-start', sm: 'center' },
  } as const;

  return (
    <Stack spacing={0.75}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ flexWrap: 'wrap', gap: { sm: 1 } }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon />}
          disabled={!canExport}
          onClick={() => downloadBrandPackJson(brand)}
          sx={btnSx}
        >
          Export brand pack
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<FileUploadOutlinedIcon />}
          onClick={() => inputRef.current?.click()}
          sx={btnSx}
        >
          Import brand pack
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={linkCopied ? <CheckIcon /> : <LinkOutlinedIcon />}
          disabled={!canExport}
          onClick={async () => {
            const url = buildShareUrl(brand);
            const ok = await copyText(url);
            if (ok) {
              setLinkCopied(true);
              window.setTimeout(() => setLinkCopied(false), 1600);
            }
          }}
          sx={btnSx}
        >
          {linkCopied ? 'Link copied' : 'Copy share link'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            try {
              const text = await file.text();
              const parsed = parseBrandPackFile(text);
              setImportError(null);
              onImport(parsed);
            } catch (err) {
              setImportError(
                err instanceof Error ? err.message : 'Import failed',
              );
            }
          }}
        />
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Share link prefills name, domain, and key colors (no logos). Export JSON
        for a full teammate handoff including logos.
      </Typography>
      {importError && (
        <Typography variant="caption" color="error">
          {importError}
        </Typography>
      )}
    </Stack>
  );
}
