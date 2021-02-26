import type { components } from '@octokit/openapi-types';
export declare type Commit = components['schemas']['commit'];
export declare type SimpleCommit = components['schemas']['simple-commit'];
export declare type File = components['schemas']['diff-entry'];
export declare type BumpType = 'patch' | 'minor' | 'major';
export declare type Comparison = Pick<components['schemas']['commit-comparison'], 'commits' | 'files'>;
declare enum CommitType {
    DEPENDENCY_UPDATE = ":arrow_up:",
    FEATURE = ":sparkles:",
    BUG = ":bug:",
    MERGE = ":twisted_rightwards_arrows:",
    OTHER = ":card_file_box:"
}
export interface EnhancedCommit extends Commit {
    type: CommitType;
}
export declare function areDiffWorthRelease({ files, commits, }: Comparison): Promise<boolean>;
export declare function retrieveChangesSinceLastRelease(githubToken: string): Promise<Comparison>;
export declare function hasPendingDependencyPRsOpen(githubToken: string): Promise<boolean>;
export declare function getCurrentBranch(githubRef: string | undefined): string;
export declare function detectBumpType(commits: Commit[]): BumpType;
export declare function version(bumpType: BumpType, githubEmail: string, githubUser: string): Promise<boolean>;
export declare function createReleaseBody(commits: Commit[]): string;
export declare function release(commits: Commit[], githubToken: string): Promise<void>;
export {};
