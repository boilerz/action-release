export declare enum Registry {
    NPM = "https://registry.npmjs.org",
    GITHUB = "https://npm.pkg.github.com"
}
export declare function getCurrentVersion(): Promise<string>;
export declare function getDevDependencies(): Promise<string[]>;
export declare function readNpmRc(filePath: string): Promise<Record<string, string> | null>;
export declare function writeNpmRc(filePath: string, fileRecord: Record<string, string>): Promise<void>;
export declare function updateNpmRcForPublish(fileRecord: Record<string, string>): Record<string, string>;
export declare function setupNpmRcForPublish(): Promise<void>;
export declare function publish(registry: Registry, directory?: string): Promise<void>;
export declare function listPackagePaths(folderPath: string): Promise<string[]>;
