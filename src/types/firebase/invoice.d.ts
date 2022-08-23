type Invoice = {
    timestamp: number;
    title: string;
    guildId: string;
    payer: string;
    debtor: Array<{ id: string; amount: number; paid: number }>;
};
