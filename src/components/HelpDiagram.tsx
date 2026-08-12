'use client';

import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { HelpDiagramId } from '@/content/help';
import { layoutTokens } from '@/theme/tokens';

type HelpDiagramProps = {
  id: HelpDiagramId;
};

const CAPTIONS: Record<HelpDiagramId, string> = {
  'studio-vs-cursor': 'Studio packages the leave-behind; Cursor is where the demo runs.',
  'wizard-steps': 'Three steps assemble the brand pack and zip.',
  'primitives-stack': 'Rules constrain, skills invoke, agents execute the multi-step work.',
  'deck-pipeline': 'Happy path inside /build-deck — from brief to PPTX.',
  'quality-loop': 'Quality comes from better inputs and a tight edit loop, not freeform design.',
  'layout-styles': 'Same content, three compiled frames — pick before you generate.',
  'customer-paths': 'Any path that yields a customer identity works; integrations are optional.',
  'databricks-optional': 'Databricks speeds account lookup; Manual entry always works.',
  'brandfetch-flow': 'Search and Prefill are independent; always review before generate.',
  'slug-ripple': 'One short slug shows up in the zip name, rule path, and folder.',
  'brand-bake': 'The brand pack becomes rules, brand docs, and exporter tokens.',
  'zip-contents': 'What lands in <slug>-deck-machine.zip after Generate.',
  'factory-outputs': 'Same brand pack → three customer-built formats (not pre-filled in the zip).',
  'after-download': 'Open in Cursor (no npm), demo the pipeline, then teach with Lab 4.',
  'talk-track': 'Package → live Cursor demo → Lab 4 → email handoff.',
  'faq-map': 'Start with the topic that matches the question you are answering.',
};

function DiagramFrame({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <Box
      role="img"
      aria-label={caption}
      sx={{
        borderRadius: 2,
        border: `1px solid ${layoutTokens.border}`,
        bgcolor: layoutTokens.bg,
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.5, sm: 2 },
      }}
    >
      {children}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mt: 1.5, lineHeight: 1.4 }}
      >
        {caption}
      </Typography>
    </Box>
  );
}

function MonoLabel({ children }: { children: ReactNode }) {
  return (
    <Typography
      className="mono"
      sx={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'text.secondary',
        mb: 0.75,
      }}
    >
      {children}
    </Typography>
  );
}

function Node({
  title,
  subtitle,
  emphasis = false,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  emphasis?: boolean;
  wide?: boolean;
}) {
  return (
    <Box
      sx={{
        flex: wide ? '1 1 100%' : { xs: '1 1 100%', sm: '1 1 0' },
        minWidth: wide ? 0 : { sm: 88 },
        px: 1.25,
        py: 1,
        borderRadius: 1.5,
        bgcolor: emphasis ? layoutTokens.text : '#FFFFFF',
        color: emphasis ? '#FFFFFF' : layoutTokens.text,
        border: emphasis ? 'none' : `1px solid ${layoutTokens.border}`,
        boxShadow: emphasis ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 600,
          fontSize: 13,
          lineHeight: 1.25,
          color: 'inherit',
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            mt: 0.35,
            fontSize: 11,
            lineHeight: 1.3,
            color: emphasis ? 'rgba(255,255,255,0.72)' : 'text.secondary',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

function Arrow() {
  return (
    <>
      <Box
        aria-hidden
        sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          color: layoutTokens.textSecondary,
          fontSize: 14,
          fontWeight: 600,
          px: 0.5,
          flexShrink: 0,
          alignSelf: 'center',
        }}
      >
        →
      </Box>
      <Box
        aria-hidden
        sx={{
          display: { xs: 'flex', sm: 'none' },
          alignItems: 'center',
          justifyContent: 'center',
          color: layoutTokens.textSecondary,
          fontSize: 12,
          fontWeight: 600,
          py: 0.15,
          flexShrink: 0,
          alignSelf: 'center',
        }}
      >
        ↓
      </Box>
    </>
  );
}

function FlowRow({
  label,
  steps,
}: {
  label?: string;
  steps: { title: string; subtitle?: string; emphasis?: boolean }[];
}) {
  return (
    <Box>
      {label && <MonoLabel>{label}</MonoLabel>}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 0.5, sm: 0 }}
        useFlexGap
        sx={{ alignItems: 'stretch' }}
      >
        {steps.map((step, i) => (
          <Box
            key={step.title}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'stretch' },
              flex: { sm: 1 },
              minWidth: 0,
            }}
          >
            <Node {...step} />
            {i < steps.length - 1 && <Arrow />}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function StudioVsCursor() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{ alignItems: 'stretch' }}
    >
      <Node
        title="Deck Machine Studio"
        subtitle="Configure brand · preview · download zip"
        wide
      />
      <Arrow />
      <Node
        title="Cursor"
        subtitle="Rules load · / skills · agents → PPTX"
        emphasis
        wide
      />
    </Stack>
  );
}

function WizardSteps() {
  return (
    <FlowRow
      steps={[
        { title: '1. Find account', subtitle: 'Identity + audience' },
        { title: '2. Encode brand', subtitle: 'Colors, type, voice, logos' },
        { title: '3. Download', subtitle: '<slug>-deck-machine.zip', emphasis: true },
      ]}
    />
  );
}

function PrimitivesStack() {
  const layers = [
    { title: 'Rules', subtitle: 'Always-on brand + contextual workflow' },
    { title: 'Skills', subtitle: '/create-brief · /build-deck · /export-pptx …' },
    { title: 'Agents', subtitle: 'deck-builder orchestrates specialists', emphasis: true },
    { title: 'Docs', subtitle: 'primitives-lab · decision-tree · after-the-demo' },
  ];
  return (
    <Stack spacing={0.75}>
      {layers.map((layer, i) => (
        <Box key={layer.title}>
          <Node {...layer} wide />
          {i < layers.length - 1 && (
            <Typography
              aria-hidden
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontSize: 12,
                lineHeight: 1.2,
                my: 0.15,
              }}
            >
              ↓
            </Typography>
          )}
        </Box>
      ))}
    </Stack>
  );
}

function DeckPipeline() {
  return (
    <Stack spacing={1.25}>
      <FlowRow
        label="Inputs"
        steps={[
          { title: 'brief.md', subtitle: '/create-brief' },
          { title: 'Outline', subtitle: 'brief-analyzer' },
        ]}
      />
      <FlowRow
        label="Write & deepen"
        steps={[
          { title: 'Slides', subtitle: 'slide-writer' },
          { title: 'Visuals', subtitle: 'visual-creator' },
          { title: 'Narrative', subtitle: 'narrative-editor' },
        ]}
      />
      <FlowRow
        label="Ship"
        steps={[
          { title: 'Brand check', subtitle: 'brand-guardian' },
          { title: 'PPTX', subtitle: 'bundled export', emphasis: true },
        ]}
      />
      <FlowRow
        label="Optional"
        steps={[
          { title: 'DOCX', subtitle: '/build-doc' },
          { title: 'XLSX', subtitle: '/export-metrics-xlsx' },
        ]}
      />
    </Stack>
  );
}

function QualityLoop() {
  return (
    <FlowRow
      steps={[
        { title: 'Brief', subtitle: 'Real notes + numbers' },
        { title: 'Outline', subtitle: '/create-outline' },
        { title: 'Build', subtitle: '/build-deck' },
        { title: 'Check', subtitle: '/brand-check' },
        { title: 'Edit → export', subtitle: 'JSON + /export-pptx', emphasis: true },
      ]}
    />
  );
}

function LayoutStyles() {
  const cards = [
    {
      id: 'classic',
      label: 'Classic',
      bg: '#BE202E',
      bar: '#BE202E',
      titleColor: '#FFFFFF',
      bodyBg: '#FFFFFF',
    },
    {
      id: 'minimal',
      label: 'Minimal',
      bg: '#FFFFFF',
      bar: '#1D1D1B',
      titleColor: '#1D1D1B',
      bodyBg: '#FFFFFF',
      rail: true,
    },
    {
      id: 'bold',
      label: 'Bold',
      bg: '#1D1D1B',
      bar: '#BE202E',
      titleColor: '#FFFFFF',
      bodyBg: '#F2F2F2',
    },
  ];

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
      {cards.map((card) => (
        <Box key={card.id} sx={{ flex: 1, minWidth: 0 }}>
          <MonoLabel>{card.label}</MonoLabel>
          <Box
            sx={{
              aspectRatio: '13.33 / 7.5',
              borderRadius: 1.5,
              border: `1px solid ${layoutTokens.border}`,
              overflow: 'hidden',
              bgcolor: card.bodyBg,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                height: '42%',
                bgcolor: card.bg,
                position: 'relative',
                px: 1,
                pt: 0.75,
                ...(card.rail
                  ? {
                      borderLeft: `3px solid ${card.bar}`,
                    }
                  : {}),
              }}
            >
              <Box
                sx={{
                  width: '55%',
                  height: 6,
                  borderRadius: 0.5,
                  bgcolor: card.titleColor,
                  opacity: 0.9,
                }}
              />
              <Box
                sx={{
                  mt: 0.5,
                  width: '35%',
                  height: 4,
                  borderRadius: 0.5,
                  bgcolor: card.titleColor,
                  opacity: 0.45,
                }}
              />
            </Box>
            <Box sx={{ px: 1, pt: 0.75 }}>
              <Box
                sx={{
                  width: 18,
                  height: 2,
                  bgcolor: card.bar,
                  mb: 0.5,
                  borderRadius: 0.5,
                }}
              />
              {[0.9, 0.7, 0.55].map((w) => (
                <Box
                  key={w}
                  sx={{
                    width: `${w * 100}%`,
                    height: 3,
                    bgcolor: layoutTokens.border,
                    mb: 0.4,
                    borderRadius: 0.5,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

function CustomerPaths() {
  return (
    <Stack spacing={1}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Node title="Databricks" subtitle="Salesforce accounts" />
        <Node title="Brandfetch" subtitle="Name → domain" />
        <Node title="Manual" subtitle="Type it in" />
      </Stack>
      <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>↓</Box>
      <Node title="Customer identity" subtitle="Name · slug · website · audience" emphasis wide />
    </Stack>
  );
}

function DatabricksOptional() {
  return (
    <Stack spacing={1}>
      <FlowRow
        label="When configured"
        steps={[
          { title: 'Search accounts', subtitle: 'Statement API' },
          { title: 'Select hit', subtitle: 'Prefill fields', emphasis: true },
        ]}
      />
      <FlowRow
        label="Always available"
        steps={[
          { title: 'Manual entry', subtitle: 'No Databricks needed' },
          { title: 'Continue wizard', subtitle: 'Generate still works', emphasis: true },
        ]}
      />
    </Stack>
  );
}

function BrandfetchFlow() {
  return (
    <Stack spacing={1.25}>
      <FlowRow
        label="Browser search"
        steps={[
          { title: 'Client ID', subtitle: 'Name → domain' },
          { title: 'Pick brand', subtitle: 'Sets website' },
        ]}
      />
      <FlowRow
        label="Server prefill"
        steps={[
          { title: 'API key', subtitle: 'Colors · fonts · logos' },
          { title: 'Review', subtitle: 'Reject stale marks', emphasis: true },
        ]}
      />
    </Stack>
  );
}

function SlugRipple() {
  return (
    <Stack spacing={0.75} sx={{ alignItems: 'stretch' }}>
      <Node title="Customer name" subtitle="e.g. Acme Corp" wide />
      <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>↓ slugify</Box>
      <Node title="acme" subtitle="Repo slug" emphasis wide />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 0.5 }}>
        <Node title="acme-deck-machine.zip" subtitle="Download name" />
        <Node title=".cursor/rules/acme-brand.mdc" subtitle="Always-on rule" />
        <Node title="Folder / paths" subtitle="Interpolated refs" />
      </Stack>
    </Stack>
  );
}

function BrandBake() {
  return (
    <Stack spacing={1}>
      <Node
        title="Brand pack in Studio"
        subtitle="Primary · dark · fonts · voice · logos · layout"
        emphasis
        wide
      />
      <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 12 }}>↓ Mustache + compile</Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Node title="Rules" subtitle="<slug>-brand.mdc" />
        <Node title="brand/" subtitle="palette · voice · logos" />
        <Node title="Exporter" subtitle="Tokens in build-pptx.js" />
      </Stack>
    </Stack>
  );
}

function FactoryOutputsDiagram() {
  return (
    <Stack spacing={1.25}>
      <FlowRow
        label="In the zip"
        steps={[
          { title: 'Rules + skills', subtitle: 'Cursor factory' },
          { title: 'brand-pack.json', subtitle: 'Shared tokens' },
          { title: 'Bundled exporters', subtitle: 'PPTX · DOCX · XLSX' },
        ]}
      />
      <FlowRow
        label="Customer builds"
        steps={[
          { title: 'Slides', subtitle: '/build-deck', emphasis: true },
          { title: 'Document', subtitle: '/build-doc' },
          { title: 'Workbook', subtitle: '/export-metrics-xlsx' },
        ]}
      />
    </Stack>
  );
}

function ZipContents() {
  const rows = [
    { path: '.cursor/rules/', note: 'Brand + workflow' },
    { path: '.cursor/agents/', note: 'Orchestrator + specialists' },
    { path: '.agents/skills/', note: 'Slash commands' },
    { path: 'brand/', note: 'Docs + logos + brand-pack.json' },
    { path: 'docs/', note: 'Lab · decision tree · day 2' },
    { path: 'scripts/bundled/', note: 'PPTX · DOCX · XLSX exporters' },
    { path: 'output/ (later)', note: 'Customer-built Office files' },
  ];
  return (
    <Stack spacing={0.5}>
      {rows.map((row) => (
        <Box
          key={row.path}
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 1,
            px: 1.25,
            py: 0.75,
            borderRadius: 1.25,
            bgcolor: '#FFFFFF',
            border: `1px solid ${layoutTokens.border}`,
          }}
        >
          <Typography
            className="mono"
            sx={{ fontSize: 12, fontWeight: 600, color: layoutTokens.text }}
          >
            {row.path}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>
            {row.note}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

function AfterDownload() {
  return (
    <FlowRow
      steps={[
        { title: 'Setup', subtitle: 'Open folder · no npm' },
        { title: 'Demo', subtitle: '/create-brief → /build-deck' },
        { title: 'Teach', subtitle: 'Lab 4 · decision tree', emphasis: true },
      ]}
    />
  );
}

function TalkTrack() {
  return (
    <FlowRow
      steps={[
        { title: 'Package', subtitle: 'Studio zip' },
        { title: 'Live demo', subtitle: 'Rules · skills · PPTX' },
        { title: 'Lab 4', subtitle: 'Break → /brand-check' },
        { title: 'Handoff', subtitle: 'Email blurb', emphasis: true },
      ]}
    />
  );
}

function FaqMap() {
  const clusters = [
    { title: 'Positioning', items: 'Overview · Account-team · FAQ' },
    { title: 'Primitives', items: 'Skills, rules, agents · Pipeline' },
    { title: 'Studio steps', items: 'Customer · Brand · Download' },
    { title: 'Formats', items: 'Factory outputs · Zip contents' },
    { title: 'After zip', items: 'After download · Improve decks' },
  ];
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      useFlexGap
      sx={{ flexWrap: 'wrap' }}
    >
      {clusters.map((c) => (
        <Box key={c.title} sx={{ flex: { sm: '1 1 40%' }, minWidth: { sm: 140 } }}>
          <Node title={c.title} subtitle={c.items} wide />
        </Box>
      ))}
    </Stack>
  );
}

function renderDiagram(id: HelpDiagramId): ReactNode {
  switch (id) {
    case 'studio-vs-cursor':
      return <StudioVsCursor />;
    case 'wizard-steps':
      return <WizardSteps />;
    case 'primitives-stack':
      return <PrimitivesStack />;
    case 'deck-pipeline':
      return <DeckPipeline />;
    case 'quality-loop':
      return <QualityLoop />;
    case 'layout-styles':
      return <LayoutStyles />;
    case 'customer-paths':
      return <CustomerPaths />;
    case 'databricks-optional':
      return <DatabricksOptional />;
    case 'brandfetch-flow':
      return <BrandfetchFlow />;
    case 'slug-ripple':
      return <SlugRipple />;
    case 'brand-bake':
      return <BrandBake />;
    case 'zip-contents':
      return <ZipContents />;
    case 'factory-outputs':
      return <FactoryOutputsDiagram />;
    case 'after-download':
      return <AfterDownload />;
    case 'talk-track':
      return <TalkTrack />;
    case 'faq-map':
      return <FaqMap />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function HelpDiagram({ id }: HelpDiagramProps) {
  return <DiagramFrame caption={CAPTIONS[id]}>{renderDiagram(id)}</DiagramFrame>;
}
