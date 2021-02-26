interface RunOptions {
    githubRef?: string;
    githubToken?: string;
    githubEmail: string;
    githubUser: string;
}
export declare const defaultRunOptions: RunOptions;
export default function run(options?: RunOptions): Promise<void>;
export {};
