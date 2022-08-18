import { firestoreDB } from '@service/firebase';
import dayjs from 'dayjs';

export async function insertDummyData(): Promise<void> {
    const dummyData: Invoice = {
        guildId: '766133385848160296',
        timestamp: dayjs().unix(),
        title: 'Foo bar',
        payer: '317217081126944769',
        debtor: {
            '604181968703193098': {
                paid: 0,
                amount: 10.0,
            },
            '246597082800979979': {
                paid: 0,
                amount: 20.0,
            },
        },
    };

    await firestoreDB.collection('invoice').add(dummyData);
}

export async function insertInvoice(invoice: Invoice): Promise<void> {
    await firestoreDB.collection('invoice').add(invoice);
}

export async function getAllInvoices(): Promise<Array<Invoice>> {
    const data: Array<Invoice> = [];
    (await firestoreDB.collection('invoice').get()).docs.forEach((value) => {
        const inv = value.data() as Invoice;
        data.push(inv);
    });
    return data;
}
