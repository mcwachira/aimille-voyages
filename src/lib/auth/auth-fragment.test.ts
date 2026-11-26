import { describe, expect, it } from "vitest";

import { readAuthFragment } from "./auth-fragment";

describe("readAuthFragment", () => {
    it.each(["invite", "recovery"] as const)("accepts complete %s tokens", (type) => {
        expect(readAuthFragment(`#access_token=access&refresh_token=refresh&type=${type}`)).toEqual({
            accessToken: "access",
            refreshToken: "refresh",
            type,
        });
    });

    it("rejects incomplete tokens and unsupported auth types", () => {
        expect(readAuthFragment("#access_token=access&type=recovery")).toBeNull();
        expect(readAuthFragment("#access_token=access&refresh_token=refresh&type=signup")).toBeNull();
    });
});
