type Invoice = {
    timestamp: number;
    title: string;
    guildId: string;
    payer: string;
    debtor: Record<string, { amount: number; paid: number }>;
};
