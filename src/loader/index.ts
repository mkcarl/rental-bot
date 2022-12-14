import {
    getAllInvoices,
    getAllInvoicesByDebtor,
} from '@service/firebase/firestore';

export default async function init(): Promise<void> {
    import('../api');
    import('@service/discord');
    import('@service/discord/listener');
}
