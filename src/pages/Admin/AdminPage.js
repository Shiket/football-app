import React, { Component } from 'react';

import { withFirebase } from '../../components/Firebase';

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));
            this.setState({
                users: usersList,
                loading: false,
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    render() {
        const { users, loading } = this.state;

        return (
            <div>
                <h1>Admin</h1>
                {loading && <div>Loading ...</div>}

                <UserList users={users} />
            </div>
        );
    }
}
const UserList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.uid}>
                <div>
                    <strong>ID:</strong> {user.uid}
                </div>
                <div>
                    <strong>Email:</strong> {user.email}
                </div>
                <div>
                    <strong>Username:</strong> {user.username}
                </div>
                <div>
                    <strong>Favourites:</strong> {user.favourites}
                </div>
            </li>
        ))}
    </ul>
);
export const AdminPage = withFirebase(Admin);