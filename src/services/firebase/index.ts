import {FirebaseOptions, initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import config from 'config'

const firebaseConfigs = config.get<FirebaseOptions>('firebaseConfig')

const app = initializeApp(firebaseConfigs)

export const analytics = getAnalytics(app);

export default app;