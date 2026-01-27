import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {UserOperations} from './userOperations';

type User = {
    userGUID: string;
    userEmail: string;
    firstName: string;
    secondName: string;
};

export default function UserCRUDDemo() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [otp, setOtp] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [operation, setOperation] = useState<'create' | 'read' | 'update' | 'delete' | null>(null);

    const handleCreate = async () => {
        if (!email || !firstName || !secondName) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        setOperation('create');
        try {
            const result = await UserOperations.createUser(email, firstName, secondName);
            if (result.success) {
                Alert.alert('Success', 'User created successfully');
                setUser(result.user || null);
                clearForm();
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create user');
        } finally {
            setLoading(false);
            setOperation(null);
        }
    };

    const handleRead = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter email');
            return;
        }

        setLoading(true);
        setOperation('read');
        try {
            const result = await UserOperations.readUser(email);
            if (result.success) {
                setUser(result.user || null);
                Alert.alert('Success', 'User found');
                window.alert('Success! User found');
            } else {
                Alert.alert('Error', result.message);
                setUser(null);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to read user');
        } finally {
            setLoading(false);
            setOperation(null);
        }
    };

    const handleUpdate = async () => {
        if (!email || !firstName || !secondName) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        setOperation('update');
        try {
            const result = await UserOperations.updateUser(email, firstName, secondName);
            if (result.success) {
                Alert.alert('Success', 'User updated successfully');
                window.alert('Success! User updated successfully');
                setUser(result.user || null);
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update user');
        } finally {
            setLoading(false);
            setOperation(null);
        }
    };

    const handleDelete = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter email');
            return;
        }

        setLoading(true);
        try {
            const result = await UserOperations.deleteUser(email, otp);
            if (result.success) {
                Alert.alert('Success', 'User deleted successfully');
                clearForm();
                setUser(null);
                setOperation(null);
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setEmail('');
        setFirstName('');
        setSecondName('');
        setOtp('');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>User CRUD Operations</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Second Name"
                    value={secondName}
                    onChangeText={setSecondName}
                />

                {operation === 'delete' && (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter OTP from email"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                    />
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.createButton]}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        {loading && operation === 'create' ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <Text style={styles.buttonText}>Create</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.readButton]}
                        onPress={handleRead}
                        disabled={loading}
                    >
                        {loading && operation === 'read' ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <Text style={styles.buttonText}>Read</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.updateButton]}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading && operation === 'update' ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <Text style={styles.buttonText}>Update</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={handleDelete}
                        disabled={loading}
                    >
                        {loading && operation === 'delete' ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <Text style={styles.buttonText}>Delete</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {user && (
                <View style={styles.userInfo}>
                    <Text style={styles.userInfoTitle}>User Details:</Text>
                    <Text>GUID: {user.userGUID}</Text>
                    <Text>Email: {user.userEmail}</Text>
                    <Text>First Name: {user.firstName}</Text>
                    <Text>Second Name: {user.secondName}</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        flex: 1,
        minWidth: '45%',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    createButton: {
        backgroundColor: '#4CAF50',
    },
    readButton: {
        backgroundColor: '#2196F3',
    },
    updateButton: {
        backgroundColor: '#FF9800',
    },
    deleteButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userInfo: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    userInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
