import { firestoreDB } from '@service/firebase';

export async function insertInvoice(invoice: Invoice): Promise<string> {
    const doc = await firestoreDB.collection('invoice').add(invoice);
    return doc.id;
}

export async function editDebtors(
    invoiceId: string,
    debtors: Debtor[]
): Promise<void> {
    const doc = await firestoreDB
        .collection('invoice')
        .doc(invoiceId)
        .update({ debtor: debtors });
}

export async function getAllInvoices(): Promise<Record<string, Invoice>> {
    const data: Record<string, Invoice> = {};
    (await firestoreDB.collection('invoice').get()).docs.forEach((value) => {
        data[value.id] = value.data() as Invoice;
    });
    return data;
}

export async function getInvoice(invoiceId: string): Promise<Invoice> {
    const doc = await firestoreDB.collection('invoice').doc(invoiceId).get();
    return (await doc.data()) as Invoice;
}

export async function getAllInvoicesByGuild(
    guildId: string
): Promise<Array<Invoice>> {
    const data: Array<Invoice> = [];
    (
        await firestoreDB
            .collection('invoice')
            .where('guildId', '==', guildId)
            .get()
    ).docs.forEach((value) => {
        const inv = value.data() as Invoice;
        data.push(inv);
    });
    return data;
}

export async function getAllInvoicesByPayer(
    payerId: string
): Promise<Array<Invoice>> {
    const data: Array<Invoice> = [];
    (
        await firestoreDB
            .collection('invoice')
            .where('payer', '==', payerId)
            .get()
    ).docs.forEach((value) => {
        const inv = value.data() as Invoice;
        data.push(inv);
    });
    return data;
}

export async function getAllInvoicesByDebtor(
    debtorId: string
): Promise<Array<Invoice>> {
    const data: Array<Invoice> = [];
    (
        await firestoreDB
            .collection('invoice')
            .orderBy(`debtor.${debtorId}`)
            .get()
    ).docs.forEach((value) => {
        const inv = value.data() as Invoice;
        data.push(inv);
    });
    return data;
}
