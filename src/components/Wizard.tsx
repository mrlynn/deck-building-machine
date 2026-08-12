'use client';

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
} from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import PaletteIcon from '@mui/icons-material/Palette';
import PreviewIcon from '@mui/icons-material/Preview';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import {
  BrandPack,
  DEFAULT_BRAND,
  SalesforceAccount,
  slugify,
} from '@/lib/types';
import {
  BrandPrefill,
  BrandSearchHit,
  searchBrandsClient,
} from '@/lib/brandfetch-client';
import { AccountLibrary } from '@/components/AccountLibrary';
import { AccountsRail } from '@/components/AccountsRail';
import { ArtifactPreviewList } from '@/components/ArtifactPreviewList';
import { BrandPackShare } from '@/components/BrandPackShare';
import { BrandTrustPanel } from '@/components/BrandTrustPanel';
import { DeckPreview } from '@/components/DeckPreview';
import { FactoryOutputPreview } from '@/components/FactoryOutputPreview';
import { HelpButton } from '@/components/HelpButton';
import { LayoutStylePicker } from '@/components/LayoutStylePicker';
import { MissionControlDialog } from '@/components/MissionControlDialog';
import { PrimitivesVideoStrip } from '@/components/PrimitivesVideoStrip';
import { RehearseDialog } from '@/components/RehearseDialog';
import { StudioAppBar } from '@/components/StudioAppBar';
import { StudioHome } from '@/components/StudioHome';
import { StudioPageHeader } from '@/components/StudioPageHeader';
import { TalkTrackDrawer } from '@/components/TalkTrackDrawer';
import { useAssistant } from '@/components/AssistantProvider';
import { useHelp } from '@/components/HelpProvider';
import { layoutTokens } from '@/theme/tokens';
import { DEFAULT_LAYOUT_STYLE, LAYOUT_STYLES, resolveLayoutStyle } from '@/lib/layouts';
import {
  applyDeepLink,
  CLEARED_LOGO_FIELDS,
  logoFieldsFromSource,
  parseBrandDeepLink,
} from '@/lib/brand-pack-io';
import { checkMarriottLeak } from '@/lib/marriott-leak';
import {
  loadRecentBrands,
  removeRecentBrand,
  saveRecentBrand,
  type RecentBrandEntry,
} from '@/lib/recent-brands';
import {
  loadHeroQuietPreference,
  saveHeroQuietPreference,
} from '@/lib/hero-quiet';
import { hasWelcomeDismissedCookie } from '@/lib/welcome-cookie';
import type { StudioHomeJobId } from '@/content/studio-home';
import { WIZARD_STEPS } from '@/content/wizard-steps';
import {
  BRAND_PACK_ENTER_ALERT,
  DEMO_SCRIPT_BULLETS,
  DEMO_SCRIPT_HELP_TOPIC,
  DEMO_SCRIPT_TITLE,
  FIELD_CAPTIONS,
  POST_DOWNLOAD_ARC,
  PRIMITIVE_STRIP,
} from '@/content/teachable-moments';
import {
  factoryOutputById,
  type FactoryOutputId,
} from '@/content/factory-outputs';

type StudioScreen = 'home' | 'wizard';

const heroHelpLinkSx = {
  display: 'inline',
  p: 0,
  m: 0,
  border: 'none',
  bgcolor: 'transparent',
  color: 'text.primary',
  textDecoration: 'underline',
  textUnderlineOffset: 3,
  cursor: 'pointer',
  font: 'inherit',
} as const;

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      className="mono"
      sx={{
        color: 'text.secondary',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Typography>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Wizard() {
  const { openHelp } = useHelp();
  const { openAssistant, setWizardState } = useAssistant();
  const [activeStep, setActiveStep] = useState(0);
  const [brand, setBrand] = useState<BrandPack>({ ...DEFAULT_BRAND });
  const [query, setQuery] = useState('');
  const [accounts, setAccounts] = useState<SalesforceAccount[]>([]);
  const [dbConfigured, setDbConfigured] = useState<boolean | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [brandApiReady, setBrandApiReady] = useState(false);
  const [brandClientId, setBrandClientId] = useState<string | null>(null);
  const [brandHits, setBrandHits] = useState<BrandSearchHit[]>([]);
  const [brandQuery, setBrandQuery] = useState('');
  const [brandSearching, setBrandSearching] = useState(false);
  const [brandSearchError, setBrandSearchError] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [prefillNotice, setPrefillNotice] = useState<string | null>(null);
  const [lastPrefillDomain, setLastPrefillDomain] = useState<string | null>(null);
  const [lastQualityScore, setLastQualityScore] = useState<number | null>(null);
  const [recentEntries, setRecentEntries] = useState<RecentBrandEntry[]>([]);
  const [talkTrackOpen, setTalkTrackOpen] = useState(false);
  const [rehearseOpen, setRehearseOpen] = useState(false);
  const [missionOpen, setMissionOpen] = useState(false);
  const [factoryFormat, setFactoryFormat] = useState<FactoryOutputId>('slides');
  const [heroQuiet, setHeroQuiet] = useState(false);
  const [forceTeachingTips, setForceTeachingTips] = useState(false);
  const [deepLinkReady, setDeepLinkReady] = useState(false);
  const [screen, setScreen] = useState<StudioScreen>('home');

  const update = useCallback((patch: Partial<BrandPack>) => {
    setBrand((prev) => ({ ...prev, ...patch }));
  }, []);

  const applyBrand = useCallback((next: BrandPack) => {
    setBrand({ ...next, layoutStyle: resolveLayoutStyle(next.layoutStyle) });
    setQuery(next.customerName);
    setBrandQuery(next.customerName);
    setPrefillNotice(null);
    setLookupError(null);
  }, []);

  const resumeAccount = useCallback(
    (pack: BrandPack) => {
      applyBrand(pack);
      setLastQualityScore(null);
      setLastPrefillDomain(pack.website || null);
      setForceTeachingTips(false);
      setActiveStep(1);
      setScreen('wizard');
    },
    [applyBrand],
  );

  const startPackage = useCallback(() => {
    setForceTeachingTips(false);
    setActiveStep(0);
    setScreen('wizard');
  }, []);

  const goHome = useCallback(() => {
    setScreen('home');
  }, []);

  const onHomeJob = useCallback(
    (id: StudioHomeJobId) => {
      switch (id) {
        case 'package':
          startPackage();
          break;
        case 'rehearse':
          setRehearseOpen(true);
          break;
        case 'talk-track':
          setTalkTrackOpen(true);
          break;
        case 'teach':
          openHelp('skills-and-rules');
          break;
        default: {
          const _exhaustive: never = id;
          return _exhaustive;
        }
      }
    },
    [openHelp, startPackage],
  );

  const applyPrefill = useCallback(
    (prefill: BrandPrefill, opts?: { keepName?: boolean }) => {
      const {
        source: _source,
        qualityScore,
        customerName: fetchedName,
        displayName: fetchedDisplay,
        ...rest
      } = prefill;

      // Always replace both logo slots from this prefill. Omitting a slot must
      // clear the previous account's mark (merge would otherwise retain it).
      const patch: Partial<BrandPack> = {
        ...rest,
        ...logoFieldsFromSource(rest),
      };
      if (!opts?.keepName && fetchedName) {
        patch.customerName = fetchedName;
        patch.customerSlug = slugify(fetchedName);
        patch.displayName = fetchedDisplay || fetchedName;
        patch.defaultAudience = `${fetchedName} leadership`;
      }

      update(patch);
      setLastPrefillDomain(prefill.website || null);
      setLastQualityScore(
        typeof qualityScore === 'number' ? qualityScore : null,
      );
      const score =
        typeof qualityScore === 'number'
          ? ` (quality ${(qualityScore * 100).toFixed(0)}%)`
          : '';
      setPrefillNotice(
        `Prefills from Brandfetch${score}. Review colors and logos — APIs sometimes return a marketing accent or stale mark.`,
      );
      setLookupError(null);
    },
    [update],
  );

  const lookupBrand = useCallback(
    async (domain: string, opts?: { keepName?: boolean }) => {
      setLookingUp(true);
      setLookupError(null);
      try {
        const res = await fetch(
          `/api/brand/lookup?domain=${encodeURIComponent(domain)}`,
        );
        const data = await res.json();
        if (!res.ok || !data.prefill) {
          throw new Error(data.error || `Brand lookup failed (${res.status})`);
        }
        applyPrefill(data.prefill as BrandPrefill, opts);
      } catch (e) {
        setLookupError(e instanceof Error ? e.message : 'Brand lookup failed');
      } finally {
        setLookingUp(false);
      }
    },
    [applyPrefill],
  );

  useEffect(() => {
    if (query.trim().length < 2) {
      setAccounts([]);
      return;
    }
    const handle = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(`/api/customers/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setDbConfigured(Boolean(data.configured));
        setAccounts(data.accounts || []);
        if (data.error) setSearchError(data.error);
        if (data.message && !data.configured) setSearchError(data.message);
      } catch (e) {
        setSearchError(e instanceof Error ? e.message : 'Search failed');
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    if (!brandClientId || brandQuery.trim().length < 2) {
      setBrandHits([]);
      return;
    }
    const handle = setTimeout(async () => {
      setBrandSearching(true);
      setBrandSearchError(null);
      try {
        const hits = await searchBrandsClient(brandQuery, brandClientId);
        setBrandHits(hits);
      } catch (e) {
        setBrandSearchError(e instanceof Error ? e.message : 'Brand search failed');
        setBrandHits([]);
      } finally {
        setBrandSearching(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [brandQuery, brandClientId]);

  useEffect(() => {
    setWizardState({
      activeStep,
      stepName: WIZARD_STEPS[activeStep]?.label ?? 'Unknown',
      customerName: brand.customerName,
      customerSlug: brand.customerSlug,
      website: brand.website,
      layoutStyle: brand.layoutStyle,
      databricksConfigured: dbConfigured,
      brandfetchReady: brandApiReady,
      brandSearchReady: Boolean(brandClientId),
    });
  }, [
    activeStep,
    brand.customerName,
    brand.customerSlug,
    brand.website,
    brand.layoutStyle,
    brandApiReady,
    brandClientId,
    dbConfigured,
    setWizardState,
  ]);

  useEffect(() => {
    fetch('/api/customers/search?q=ab')
      .then((r) => r.json())
      .then((d) => setDbConfigured(Boolean(d.configured)))
      .catch(() => setDbConfigured(false));

    fetch('/api/brand/status')
      .then((r) => r.json())
      .then((d) => {
        setBrandApiReady(Boolean(d.brandApi));
        setBrandClientId(typeof d.clientId === 'string' ? d.clientId : null);
      })
      .catch(() => {
        setBrandApiReady(false);
        setBrandClientId(null);
      });
  }, []);

  useEffect(() => {
    setRecentEntries(loadRecentBrands());
    setHeroQuiet(loadHeroQuietPreference() || hasWelcomeDismissedCookie());
  }, []);

  useEffect(() => {
    if (deepLinkReady || typeof window === 'undefined') return;
    const link = parseBrandDeepLink(
      new URLSearchParams(window.location.search),
    );
    const recent = loadRecentBrands();
    setRecentEntries(recent);

    if (link.resume && recent[0]) {
      applyBrand(recent[0].brand);
      setActiveStep(1);
      setScreen('wizard');
      setDeepLinkReady(true);
      return;
    }

    const hasIdentity = Boolean(
      link.customerName || link.website || link.customerSlug,
    );
    if (hasIdentity) {
      setBrand((prev) => applyDeepLink(prev, link));
      if (link.customerName) setQuery(link.customerName);
      if (link.website) setBrandQuery(link.website);
      setScreen('wizard');
    }
    setDeepLinkReady(true);
  }, [applyBrand, deepLinkReady]);

  const canNextCustomer = Boolean(brand.customerName.trim());
  const canNextBrand = Boolean(brand.primaryColor && brand.darkColor && brand.fontStack);
  const leakReport = checkMarriottLeak(brand);
  const downloadBlocked = leakReport.severity === 'fail';
  const heroExpanded =
    forceTeachingTips || (!heroQuiet && activeStep === 0);

  async function onGenerate() {
    setGenerating(true);
    setGenError(null);
    try {
      const pack: BrandPack = {
        ...brand,
        customerSlug: brand.customerSlug || slugify(brand.customerName),
        layoutStyle: resolveLayoutStyle(brand.layoutStyle),
      };
      if (checkMarriottLeak(pack).severity === 'fail') {
        throw new Error(
          'Brand pack still has reference leftovers — fix the highlighted fields before download.',
        );
      }
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: pack }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Generate failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pack.customerSlug}-deck-machine.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setRecentEntries(saveRecentBrand(pack, { downloaded: true }));
      setMissionOpen(true);
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Generate failed');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <StudioAppBar
        onPackage={startPackage}
        onOpenRehearse={() => setRehearseOpen(true)}
        onOpenTalkTrack={() => setTalkTrackOpen(true)}
        onOpenAssistant={openAssistant}
        onOpenHelp={() => openHelp('overview')}
        onGoHome={goHome}
      />

      <Stack
        direction="row"
        sx={{
          width: '100%',
          alignItems: 'stretch',
          minHeight: {
            xs: `calc(100vh - ${layoutTokens.mainHeaderHeight}px)`,
            md: '100vh',
          },
        }}
      >
        <AccountsRail
          entries={recentEntries}
          homeActive={screen === 'home'}
          activeSlug={
            screen === 'wizard' ? brand.customerSlug || undefined : undefined
          }
          onSelect={(entry) => resumeAccount(entry.brand)}
          onRemove={(id) => setRecentEntries(removeRecentBrand(id))}
          onGoHome={goHome}
          onPackage={startPackage}
          onOpenRehearse={() => setRehearseOpen(true)}
          onOpenTalkTrack={() => setTalkTrackOpen(true)}
          onOpenAssistant={openAssistant}
          onOpenHelp={() => openHelp('overview')}
        />

        <Box sx={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 0 }}>
          {screen === 'home' ? (
            <StudioHome
              recentEntries={recentEntries}
              onJob={onHomeJob}
              onResume={(entry) => resumeAccount(entry.brand)}
              onRemove={(id) => setRecentEntries(removeRecentBrand(id))}
            />
          ) : (
      <Container
        maxWidth="lg"
        sx={{
          ml: 0,
          mr: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 2.5, md: 4 },
          pb: { xs: 3, sm: 8, md: 6 },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2, alignItems: 'center', display: { md: 'none' } }}
        >
          <Chip
            size="small"
            label="Home"
            onClick={goHome}
            sx={{ cursor: 'pointer' }}
          />
          <Typography variant="caption" color="text.secondary">
            Job starters and account list
          </Typography>
        </Stack>

        <Stack
          spacing={heroExpanded ? 1.5 : 1}
          sx={{ mb: { xs: 2.5, md: heroExpanded ? 4 : 2.5 } }}
        >
          <Kicker>ADM / FE toolkit</Kicker>
          {heroExpanded ? (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: 26, sm: 32, md: undefined },
                  lineHeight: { xs: 1.25, md: undefined },
                }}
              >
                Build a Cursor demo of skills, rules, and agents
              </Typography>
              <Typography color="text.secondary">
                Package a branded leave-behind your customer opens in Cursor — rules,
                skills, and agents working together.
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => openHelp('skills-and-rules')}
                  sx={heroHelpLinkSx}
                >
                  Skills, rules, and agents
                </Box>
                <Typography component="span" color="text.secondary" variant="body2">
                  ·
                </Typography>
                <Box
                  component="button"
                  type="button"
                  onClick={() => openHelp('how-it-works')}
                  sx={heroHelpLinkSx}
                >
                  How the wizard works
                </Box>
                <Typography component="span" color="text.secondary" variant="body2">
                  ·
                </Typography>
                <Box
                  component="button"
                  type="button"
                  onClick={() => openHelp('faq')}
                  sx={heroHelpLinkSx}
                >
                  FAQ
                </Box>
              </Stack>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.25}
                sx={{ pt: 0.5 }}
              >
                {PRIMITIVE_STRIP.map((item) => (
                  <Box
                    key={item.id}
                    component="button"
                    type="button"
                    onClick={() => openHelp(item.helpTopic)}
                    sx={{
                      flex: 1,
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: 2,
                      border: `1px solid ${layoutTokens.border}`,
                      bgcolor: '#fff',
                      p: 1.5,
                      font: 'inherit',
                      transition: 'border-color 120ms ease, background-color 120ms ease',
                      '&:hover': {
                        borderColor: layoutTokens.text,
                        bgcolor: layoutTokens.hover,
                      },
                    }}
                  >
                    <Typography
                      className="mono"
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'text.secondary',
                        mb: 0.5,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.45 }}
                    >
                      {item.caption}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <PrimitivesVideoStrip />
              <Button
                size="small"
                onClick={() => {
                  saveHeroQuietPreference(true);
                  setHeroQuiet(true);
                  setForceTeachingTips(false);
                }}
                sx={{ alignSelf: 'flex-start' }}
              >
                Hide teaching tips
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: 20, sm: 22 },
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                Build a Cursor demo of skills, rules, and agents
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Package a branded leave-behind, then demo Rules, Skills, and Agents in
                Cursor.
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: 'wrap', gap: 1, pt: 0.25, alignItems: 'center' }}
              >
                {PRIMITIVE_STRIP.map((item) => (
                  <Chip
                    key={item.id}
                    size="small"
                    label={item.label}
                    onClick={() => openHelp(item.helpTopic)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
                <Chip
                  size="small"
                  variant="outlined"
                  label="FAQ"
                  onClick={() => openHelp('faq')}
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  saveHeroQuietPreference(false);
                  setHeroQuiet(false);
                  setForceTeachingTips(true);
                }}
                sx={{ alignSelf: 'flex-start' }}
              >
                Show teaching tips
              </Button>
            </>
          )}
        </Stack>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          mb: { xs: 2.5, md: 4 },
          '& .MuiStepLabel-label': {
            typography: 'caption',
            mt: { xs: 0.5, sm: 1 },
            fontSize: { xs: 11, sm: 12 },
            lineHeight: 1.25,
          },
          '& .MuiStepConnector-line': {
            minHeight: 2,
          },
        }}
      >
        {WIZARD_STEPS.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box className="surface-card" sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={3}>
              <StudioPageHeader
                icon={<SearchIcon fontSize="small" />}
                title={WIZARD_STEPS[0].title}
                subtitle={WIZARD_STEPS[0].subtitle}
                helpTopic={WIZARD_STEPS[0].helpTopic}
                trailing={
                  <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                    {dbConfigured === true && (
                      <Chip size="small" color="success" label="Databricks" />
                    )}
                    {dbConfigured === false && (
                      <Chip size="small" label="Manual entry" />
                    )}
                    {brandClientId && (
                      <Chip size="small" color="success" label="Brand search" />
                    )}
                    {brandApiReady && (
                      <Chip size="small" color="success" label="Brand API" />
                    )}
                  </Stack>
                }
              />

              {searchError && <Alert severity="info">{searchError}</Alert>}

              {recentEntries.length > 0 ? (
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Recent accounts</Typography>
                  <AccountLibrary
                    entries={recentEntries}
                    onSelect={(entry) => resumeAccount(entry.brand)}
                    onRemove={(id) => setRecentEntries(removeRecentBrand(id))}
                  />
                </Stack>
              ) : null}

              <BrandPackShare
                brand={brand}
                onImport={(pack) => {
                  applyBrand(pack);
                  setLastQualityScore(null);
                  setLastPrefillDomain(pack.website || null);
                  setPrefillNotice('Brand pack imported. Review colors and logos, then continue.');
                }}
              />

              <Autocomplete
                freeSolo
                options={accounts}
                getOptionLabel={(o) => (typeof o === 'string' ? o : o.name)}
                filterOptions={(x) => x}
                loading={searching}
                inputValue={query}
                onInputChange={(_, v) => setQuery(v)}
                onChange={(_, value) => {
                  if (!value || typeof value === 'string') {
                    if (typeof value === 'string') {
                      update({
                        customerName: value,
                        customerSlug: slugify(value),
                        defaultAudience: `${value} leadership`,
                        ...CLEARED_LOGO_FIELDS,
                      });
                    }
                    return;
                  }
                  update({
                    customerName: value.name,
                    customerSlug: slugify(value.name),
                    website: value.website || undefined,
                    industry: value.industry || undefined,
                    salesforceAccountId: value.id,
                    displayName: value.name,
                    defaultAudience: `${value.name} leadership`,
                    ...CLEARED_LOGO_FIELDS,
                  });
                  setQuery(value.name);
                  setPrefillNotice(null);
                  setLastPrefillDomain(null);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Stack>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {[option.type, option.industry, option.website]
                          .filter(Boolean)
                          .join(' · ')}
                      </Typography>
                    </Stack>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Salesforce accounts (Databricks)"
                    placeholder="e.g. Marriott, Stripe, Acme"
                    helperText={
                      searching
                        ? 'Searching…'
                        : 'Pulls from revops.pt_salesforce.account when configured'
                    }
                  />
                )}
              />

              {brandClientId && (
                <>
                  <Divider>or match a brand name</Divider>
                  {brandSearchError && (
                    <Alert severity="warning">{brandSearchError}</Alert>
                  )}
                  <Autocomplete
                    options={brandHits}
                    getOptionLabel={(o) =>
                      o.name ? `${o.name} (${o.domain})` : o.domain
                    }
                    filterOptions={(x) => x}
                    loading={brandSearching}
                    inputValue={brandQuery}
                    onInputChange={(_, v) => setBrandQuery(v)}
                    onChange={(_, value) => {
                      if (!value) return;
                      const name = value.name || value.domain;
                      update({
                        customerName: name,
                        customerSlug: slugify(name),
                        website: value.domain,
                        displayName: value.name || undefined,
                        defaultAudience: `${name} leadership`,
                        salesforceAccountId: undefined,
                        ...CLEARED_LOGO_FIELDS,
                      });
                      setBrandQuery(value.name || value.domain);
                      setQuery(name);
                      setPrefillNotice(null);
                      setLastPrefillDomain(null);
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option.brandId || option.domain}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                          {option.icon && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={option.icon}
                              alt=""
                              width={24}
                              height={24}
                              style={{ borderRadius: 4 }}
                            />
                          )}
                          <Stack>
                            <Typography variant="body1">
                              {option.name || option.domain}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.domain}
                            </Typography>
                          </Stack>
                        </Stack>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search brands (Brandfetch)"
                        placeholder="e.g. Stripe, Notion, Acme"
                        helperText={
                          brandSearching
                            ? 'Searching…'
                            : 'Name → domain autocomplete. Brand pack prefills on the next step.'
                        }
                      />
                    )}
                  />
                </>
              )}

              <Divider>or enter manually</Divider>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Customer name"
                    value={brand.customerName}
                    onChange={(e) =>
                      update({
                        customerName: e.target.value,
                        customerSlug: slugify(e.target.value),
                        defaultAudience: `${e.target.value} leadership`,
                      })
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'flex-start' }}>
                    <TextField
                      fullWidth
                      label="Repo slug"
                      value={brand.customerSlug}
                      onChange={(e) => update({ customerSlug: slugify(e.target.value) })}
                      helperText="Used in folder names and rule filenames"
                    />
                    <HelpButton topic="repo-slug" sx={{ mt: 1 }} />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={brand.website || ''}
                    onChange={(e) => update({ website: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Industry"
                    value={brand.industry || ''}
                    onChange={(e) => update({ industry: e.target.value })}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Default audience"
                    value={brand.defaultAudience}
                    onChange={(e) => update({ defaultAudience: e.target.value })}
                  />
                </Grid>
              </Grid>

              <Stack
                direction="row"
                sx={{ justifyContent: { xs: 'stretch', sm: 'flex-end' } }}
              >
                <Button
                  variant="contained"
                  disabled={!canNextCustomer}
                  fullWidth
                  sx={{ width: { sm: 'auto' } }}
                  onClick={() => {
                    setForceTeachingTips(false);
                    setActiveStep(1);
                    if (
                      brandApiReady &&
                      brand.website &&
                      brand.website !== lastPrefillDomain
                    ) {
                      void lookupBrand(brand.website, { keepName: true });
                    }
                  }}
                >
                  Next: Brand pack
                </Button>
              </Stack>
            </Stack>
        </Box>
      )}

      {activeStep === 1 && (
        <Box className="surface-card" sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={3}>
              <StudioPageHeader
                icon={<PaletteIcon fontSize="small" />}
                title={WIZARD_STEPS[1].title}
                subtitle={WIZARD_STEPS[1].subtitle}
                helpTopic={WIZARD_STEPS[1].helpTopic}
              />

              <Alert severity="info">{BRAND_PACK_ENTER_ALERT}</Alert>

              {prefillNotice && (
                <Alert severity="info" onClose={() => setPrefillNotice(null)}>
                  {prefillNotice}
                </Alert>
              )}
              {lookupError && <Alert severity="warning">{lookupError}</Alert>}

              <BrandTrustPanel
                brand={brand}
                qualityScore={lastQualityScore}
                showPrefill
                showLeakCheck={false}
              />

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ flexWrap: 'wrap', gap: 1, alignItems: { sm: 'center' } }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ width: { sm: 'auto' } }}
                  startIcon={
                    lookingUp ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <AutoFixHighIcon />
                    )
                  }
                  disabled={!brandApiReady || !brand.website || lookingUp}
                  onClick={() => {
                    if (brand.website) void lookupBrand(brand.website, { keepName: true });
                  }}
                >
                  {lookingUp ? 'Fetching brand…' : 'Prefill from Brandfetch'}
                </Button>
                {!brandApiReady && (
                  <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    Set BRANDFETCH_API_KEY to enable prefill
                  </Typography>
                )}
                {brandApiReady && !brand.website && (
                  <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    Add a website on the Customer step to fetch brand details
                  </Typography>
                )}
              </Stack>

              <Grid container spacing={2}>
                <Grid size={12}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Colors
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {FIELD_CAPTIONS.colors.caption}
                  </Typography>
                </Grid>
                {(
                  [
                    ['primaryColor', 'Primary'],
                    ['darkColor', 'Dark'],
                    ['grayColor', 'Gray'],
                    ['lightGrayColor', 'Light gray'],
                    ['midGrayColor', 'Mid gray'],
                    ['accentColor', 'Accent'],
                  ] as const
                ).map(([key, label]) => (
                  <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Box
                        component="input"
                        type="color"
                        value={brand[key]}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          update({ [key]: e.target.value })
                        }
                        sx={{
                          width: 44,
                          height: 44,
                          border: 'none',
                          bgcolor: 'transparent',
                          flexShrink: 0,
                        }}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        label={label}
                        value={brand[key]}
                        onChange={(e) => update({ [key]: e.target.value })}
                      />
                    </Stack>
                  </Grid>
                ))}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Font stack"
                    value={brand.fontStack}
                    onChange={(e) => update({ fontStack: e.target.value })}
                    helperText={FIELD_CAPTIONS.fonts.caption}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Voice summary"
                    value={brand.voiceSummary}
                    onChange={(e) => update({ voiceSummary: e.target.value })}
                    helperText={FIELD_CAPTIONS.voice.caption}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Words to avoid (comma-separated)"
                    value={brand.wordsToAvoid.join(', ')}
                    onChange={(e) =>
                      update({
                        wordsToAvoid: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    helperText={FIELD_CAPTIONS.wordsToAvoid.caption}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button variant="outlined" component="label" fullWidth>
                    Logo on dark / primary (PNG)
                    <input
                      type="file"
                      hidden
                      accept="image/png,image/svg+xml,image/jpeg"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) update({ logoOnDarkBase64: await fileToBase64(f) });
                      }}
                    />
                  </Button>
                  {brand.logoOnDarkBase64 ? (
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ mt: 1.25, alignItems: 'center' }}
                    >
                      <Box
                        sx={{
                          width: 72,
                          height: 56,
                          borderRadius: 1.5,
                          bgcolor: brand.primaryColor,
                          border: `1px solid ${layoutTokens.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={brand.logoOnDarkBase64}
                          alt="Logo on dark / primary"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                      <Stack spacing={0.5}>
                        <Chip size="small" label="On dark / primary" color="success" />
                        <Typography variant="caption" color="text.secondary">
                          From Brandfetch or upload · footer on primary slides
                        </Typography>
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Prefill from Brandfetch or upload a light/white mark
                    </Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button variant="outlined" component="label" fullWidth>
                    Logo on light (PNG)
                    <input
                      type="file"
                      hidden
                      accept="image/png,image/svg+xml,image/jpeg"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) update({ logoOnLightBase64: await fileToBase64(f) });
                      }}
                    />
                  </Button>
                  {brand.logoOnLightBase64 ? (
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ mt: 1.25, alignItems: 'center' }}
                    >
                      <Box
                        sx={{
                          width: 72,
                          height: 56,
                          borderRadius: 1.5,
                          bgcolor: brand.lightGrayColor || '#F2F2F2',
                          border: `1px solid ${layoutTokens.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={brand.logoOnLightBase64}
                          alt="Logo on light"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                      <Stack spacing={0.5}>
                        <Chip size="small" label="On light" color="success" />
                        <Typography variant="caption" color="text.secondary">
                          From Brandfetch or upload · footer on white slides
                        </Typography>
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Prefill from Brandfetch or upload a dark/color mark
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle2">Deck layout style</Typography>
                  <HelpButton topic="layout-preview" label="Help: layout styles and preview" />
                </Stack>
                <LayoutStylePicker
                  value={resolveLayoutStyle(brand.layoutStyle ?? DEFAULT_LAYOUT_STYLE)}
                  onChange={(layoutStyle) => update({ layoutStyle })}
                  hideTitle
                  teachableCaption={FIELD_CAPTIONS.layout.caption}
                />
              </Box>

              <DeckPreview brand={brand} />

              <Stack
                direction={{ xs: 'column-reverse', sm: 'row' }}
                spacing={1}
                sx={{ justifyContent: 'space-between' }}
              >
                <Button
                  onClick={() => setActiveStep(0)}
                  fullWidth
                  sx={{ width: { sm: 'auto' } }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  disabled={!canNextBrand}
                  fullWidth
                  sx={{ width: { sm: 'auto' } }}
                  onClick={() => {
                    setForceTeachingTips(false);
                    setRecentEntries(saveRecentBrand(brand));
                    setActiveStep(2);
                  }}
                >
                  Next: Preview
                </Button>
              </Stack>
            </Stack>
        </Box>
      )}

      {activeStep === 2 && (
        <Box className="surface-card" sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={3}>
              <StudioPageHeader
                icon={<PreviewIcon fontSize="small" />}
                title={WIZARD_STEPS[2].title}
                subtitle={WIZARD_STEPS[2].subtitle}
                helpTopic={WIZARD_STEPS[2].helpTopic}
              />

              <Alert severity="success">
                Ready:{' '}
                <strong>{brand.customerSlug}-deck-machine.zip</strong>
                {' · '}
                {LAYOUT_STYLES[resolveLayoutStyle(brand.layoutStyle)].label}
                {' · '}
                for {brand.customerName || 'your customer'}
                {' · '}
                Cursor factory (skills + bundled exporters — not finished Office files)
              </Alert>

              <BrandTrustPanel
                brand={brand}
                qualityScore={lastQualityScore}
                showPrefill={false}
                showLeakCheck
              />

              <FactoryOutputPreview
                brand={brand}
                format={factoryFormat}
                onFormatChange={setFactoryFormat}
              />

              <Box>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">What&apos;s in the zip</Typography>
                  <HelpButton topic="skills-and-rules" label="Help: skills, rules, and agents" />
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  These are Cursor primitives the customer opens after unzip — not pre-built
                  decks or documents. Flip Factory outputs above to highlight the matching
                  exporter. Expand a row for branded contents and a demo tip.{' '}
                  <Box
                    component="button"
                    type="button"
                    onClick={() =>
                      openHelp(factoryFormat === 'slides' ? 'deck-pipeline' : 'factory-outputs')
                    }
                    sx={{
                      display: 'inline',
                      p: 0,
                      m: 0,
                      border: 'none',
                      bgcolor: 'transparent',
                      color: 'text.primary',
                      textDecoration: 'underline',
                      textUnderlineOffset: 2,
                      cursor: 'pointer',
                      font: 'inherit',
                    }}
                  >
                    {factoryFormat === 'slides'
                      ? 'How the PPTX gets built'
                      : `How ${factoryOutputById(factoryFormat).label.toLowerCase()} fits`}
                  </Box>
                </Typography>
                <ArtifactPreviewList
                  brand={brand}
                  active={activeStep === 2}
                  highlightPath={factoryOutputById(factoryFormat).artifactPath}
                />
              </Box>

              <Box
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${layoutTokens.border}`,
                  bgcolor: layoutTokens.sidebarBg,
                  p: 2,
                }}
              >
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">{DEMO_SCRIPT_TITLE}</Typography>
                  <HelpButton topic="account-team" label="Help: account-team talk track" />
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  {POST_DOWNLOAD_ARC}{' '}
                  <Box
                    component="button"
                    type="button"
                    onClick={() => openHelp(DEMO_SCRIPT_HELP_TOPIC)}
                    sx={{
                      display: 'inline',
                      p: 0,
                      m: 0,
                      border: 'none',
                      bgcolor: 'transparent',
                      color: 'text.primary',
                      textDecoration: 'underline',
                      textUnderlineOffset: 2,
                      cursor: 'pointer',
                      font: 'inherit',
                    }}
                  >
                    After you download
                  </Box>
                </Typography>
                <Stack component="ol" spacing={0.75} sx={{ m: 0, pl: 2.25, mb: 1.5 }}>
                  {DEMO_SCRIPT_BULLETS.slice(0, 3).map((bullet) => (
                    <Typography
                      key={bullet}
                      component="li"
                      variant="body2"
                      color="text.secondary"
                      sx={{ pl: 0.5 }}
                    >
                      {bullet}
                    </Typography>
                  ))}
                </Stack>
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  startIcon={<RecordVoiceOverOutlinedIcon />}
                  onClick={() => setTalkTrackOpen(true)}
                  sx={{ width: { sm: 'auto' } }}
                >
                  Open talk track
                </Button>
              </Box>

              {genError && <Alert severity="error">{genError}</Alert>}

              <Stack
                direction={{ xs: 'column-reverse', sm: 'row' }}
                spacing={1}
                sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
              >
                <Button
                  onClick={() => setActiveStep(1)}
                  fullWidth
                  sx={{ width: { sm: 'auto' } }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ width: { sm: 'auto' } }}
                  startIcon={
                    generating ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />
                  }
                  disabled={generating || downloadBlocked}
                  onClick={onGenerate}
                >
                  {generating ? 'Generating…' : 'Download deck machine'}
                </Button>
              </Stack>
            </Stack>
        </Box>
      )}
      </Container>
          )}
        </Box>
      </Stack>

      <TalkTrackDrawer
        open={talkTrackOpen}
        onClose={() => setTalkTrackOpen(false)}
        activeStep={activeStep}
        onOpenRehearse={() => {
          setTalkTrackOpen(false);
          setRehearseOpen(true);
        }}
      />
      <RehearseDialog
        open={rehearseOpen}
        onClose={() => setRehearseOpen(false)}
        customerSlug={brand.customerSlug || slugify(brand.customerName)}
      />
      <MissionControlDialog
        open={missionOpen}
        onClose={() => setMissionOpen(false)}
        customerName={brand.customerName}
        customerSlug={brand.customerSlug || slugify(brand.customerName)}
      />
    </Box>
  );
}
