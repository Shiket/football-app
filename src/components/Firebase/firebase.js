import app from 'firebase/app';
import 'firebase/auth'
import FirebaseContext, { withFirebase } from './context';
import 'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
    }

    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');
    username = uid => this.db.ref(`users/${uid}/username`);

    getFavourites = uid => this.db.ref(`users/${uid}/favourites`)

    doCreateUserWithEmailAndPassword = async (email, password) =>
        await this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = async (email, password) =>
        await this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = async () => await this.auth.signOut();
    doPasswordReset = async email => await this.auth.sendPasswordResetEmail(email);
    doPasswordUpdate = async password => await this.auth.currentUser.updatePassword(password);

    addRemoveFromFavourites = async (uid, teamId) => {
        const favRef = this.db.ref(`users/${uid}/favourites`)
        favRef.once("value", snapshot => {
            const favList = snapshot.val();
            favList === null ? favRef.set([teamId]) :
                (favList.includes(teamId) ? favRef.set(favList.filter(a => a !== teamId)) : favRef.set([...favList, teamId]));
        })
    }

    removeTeamFromFavourites = async (teamId, uid) => {
        const ref = this.db.ref(`users/${uid}/favourites`)
        ref.once("value", snapshot => {
            const favList = snapshot.val();
            favList.length > 1 ? ref.set(favList.filter(a => a !== teamId)) : ref.set("")
        })
    }
}
export default Firebase;
export { FirebaseContext, withFirebase };