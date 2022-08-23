type Invoice = {
    timestamp: number;
    title: string;
    guildId: string;
    payer: string;
    debtor: Debtor[];
};

type Debtor = { id: string; amount: number; paid: number };
