import { requireOptionalNativeModule } from "expo-modules-core";

type RestActivityModule = {
  isSupported(): boolean;
  start(endsAtMs: number, title: string): void;
  update(endsAtMs: number): void;
  end(): void;
};

// null on platforms where the native module isn't linked (Android, web).
export default requireOptionalNativeModule<RestActivityModule>("RestActivity");
