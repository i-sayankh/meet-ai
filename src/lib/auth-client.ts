import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";

const polarPlugin = polarClient();

// @polar-sh/better-auth's $InferServerPlugin.init() return type declares its
// context param as nullable instead of optional, which breaks structural
// assignability to BetterAuthClientPlugin. Patch just that signature so the
// rest of the plugin (endpoints, actions) keeps its real inferred type.
type PatchedPolarPlugin = Omit<typeof polarPlugin, "$InferServerPlugin"> & {
  $InferServerPlugin: Omit<typeof polarPlugin.$InferServerPlugin, "init"> & {
    init(): void;
  };
};

export const authClient = createAuthClient({
  plugins: [polarPlugin as PatchedPolarPlugin],
});
