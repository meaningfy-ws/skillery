import {
  inferBundleFromInstallAlias,
  loadCatalogue,
  normalizeBundleSelection,
  PACKAGE_ROOT,
  skillDirectories,
  validateBundles,
} from "./opencode-bundle-lib.mjs";

function selectedBundles(catalogue, options) {
  const configured = normalizeBundleSelection(options?.bundles ?? options?.bundle);
  if (configured.length > 0) return validateBundles(catalogue, configured);

  const fromEnvironment = normalizeBundleSelection(process.env.MEANINGFY_SKILLERY_BUNDLES);
  if (fromEnvironment.length > 0) return validateBundles(catalogue, fromEnvironment);

  const inferred = inferBundleFromInstallAlias(catalogue, PACKAGE_ROOT);
  if (inferred) return [inferred];

  return ["meaningfy-core"];
}

export default async function SkilleryOpenCodePlugin(_input, options = {}) {
  const catalogue = loadCatalogue();
  const bundles = selectedBundles(catalogue, options);
  const skills = skillDirectories(catalogue, bundles);
  let check = null;
  try {
    ({ check } = await import("../mods/no-poll-loops/no-poll-loops.mjs"));
  } catch {
    // fail open: a missing module disables only the check, never the plugin
  }

  return {
    // Behaviour, not content: active whatever the bundle selection (lean-delivery D-5).
    "tool.execute.before": async (input, output) => {
      let message = null;
      try {
        if (check && input?.tool === "bash") message = check(output?.args?.command);
      } catch {
        // fail open: an error in the check lets the command run
      }
      if (message) throw new Error(message);
    },
    config: async (config) => {
      config.skills ??= {};
      config.skills.paths ??= [];
      for (const skill of skills) {
        if (!config.skills.paths.includes(skill.directory)) {
          config.skills.paths.push(skill.directory);
        }
      }
    },
  };
}
