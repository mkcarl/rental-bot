declare global {}
namespace NodeJS {
    interface ProcessEnv {
        DISCORD_API_TOKEN: string;
    }
}

export {};
