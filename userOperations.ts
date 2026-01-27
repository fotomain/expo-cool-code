import {createClient} from '@supabase/supabase-js';
import {v4 as uuidv4} from "uuid";

// Initialize Supabase client
const supabaseUrl: any = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey: any = process.env.EXPO_PUBLIC_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
    userGUID: string;
    userEmail: string;
    firstName: string;
    secondName: string;
}

interface OperationResult {
    success: boolean;
    message: string;
    user?: User;
}

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore: Map<string, { otp: string; timestamp: number }> = new Map();

export class UserOperations {
    // Create user operation

    static async createUser(email: string, firstName: string, secondName: string): Promise<OperationResult> {
        try {
            // Check if user already exists
            const {data: existingUser, error: checkError} = await supabase
                .from('users1')
                .select('*')
                .eq('userEmail', email.toLowerCase().trim())
                .single();

            console.log("existingUser1", existingUser)
            console.log("checkError1", checkError)

            if (existingUser) {
                return {
                    success: false,
                    message: 'User with this email already exists',
                };
            }

            if (checkError && checkError.code !== 'PGRST116') {
                return {
                    success: false,
                    message: `Error checking user: ${checkError.message}`,
                };
            }

            // Generate UUID
            const userGUID = uuidv4();

            // Create new user
            const {data, error} = await supabase
                .from('users1')
                .insert([
                    {
                        userGUID,
                        userEmail: email.toLowerCase().trim(),
                        firstName: firstName.trim(),
                        secondName: secondName.trim(),
                    },
                ])
                .select()
                .single();

            if (error) {
                return {
                    success: false,
                    message: `Error creating user: ${error.message}`,
                };
            }

            return {
                success: true,
                message: 'User created successfully',
                user: data as User,
            };
        } catch (error) {
            return {
                success: false,
                message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    }


    // Read user operation
    static async readUser(email: string): Promise<OperationResult> {
        try {
            const {data, error} = await supabase
                .from('users1')
                .select('*')
                .eq('userEmail', email.toLowerCase().trim())
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return {
                        success: false,
                        message: 'User not found',
                    };
                }
                return {
                    success: false,
                    message: `Error reading user: ${error.message}`,
                };
            }

            return {
                success: true,
                message: 'User found',
                user: data as User,
            };
        } catch (error) {
            return {
                success: false,
                message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    }

    // Update user operation
    static async updateUser(email: string, firstName: string, secondName: string): Promise<OperationResult> {
        try {
            // First check if user exists
            const {data: existingUser, error: checkError} = await supabase
                .from('users1')
                .select('*')
                .eq('userEmail', email.toLowerCase().trim())
                .single();

            if (checkError && checkError.code === 'PGRST116') {
                return {
                    success: false,
                    message: 'User not found',
                };
            }

            // Update user
            const {data, error} = await supabase
                .from('users1')
                .update({
                    firstName: firstName.trim(),
                    secondName: secondName.trim(),
                    updatedAt: new Date().toISOString(),
                })
                .eq('userEmail', email.toLowerCase().trim())
                .select()
                .single();

            if (error) {
                return {
                    success: false,
                    message: `Error updating user: ${error.message}`,
                };
            }

            return {
                success: true,
                message: 'User updated successfully',
                user: data as User,
            };
        } catch (error) {
            return {
                success: false,
                message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    }

    // Request OTP for deletion
    static async requestDeleteOtp(email: string): Promise<OperationResult> {
        try {
            // Check if user exists
            const {data: existingUser, error: checkError} = await supabase
                .from('users1')
                .select('*')
                .eq('userEmail', email.toLowerCase().trim())
                .single();

            if (checkError && checkError.code === 'PGRST116') {
                return {
                    success: false,
                    message: 'User not found',
                };
            }

            // Generate 4-digit OTP
            const otp = Math.floor(1000 + Math.random() * 9000).toString();

            // Store OTP with timestamp
            otpStore.set(email.toLowerCase().trim(), {
                otp,
                timestamp: Date.now(),
            });

            // In production, implement actual email sending here
            // For demo purposes, we'll log it and show an alert
            console.log(`OTP for ${email}: ${otp}`);

            // Example using Supabase Edge Functions for email (uncomment and configure in production):
            /*
            const { error: emailError } = await supabase.functions.invoke('send-otp', {
              body: { email, otp }
            });

            if (emailError) {
              return {
                success: false,
                message: `Failed to send OTP: ${emailError.message}`,
              };
            }
            */

            return {
                success: true,
                message: 'OTP sent to email',
            };
        } catch (error) {
            return {
                success: false,
                message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    }

    // Delete user with OTP verification
    static async deleteUser(email: string, otp: string): Promise<OperationResult> {
        try {

            // Check if user exists
            const {data: existingUser, error: checkError} = await supabase
                .from('users1')
                .select('*')
                .eq('userEmail', email.toLowerCase().trim())
                .single();

            if (checkError && checkError.code === 'PGRST116') {
                return {
                    success: false,
                    message: 'User not found',
                };
            }

            // Delete user
            const {error} = await supabase
                .from('users1')
                .delete()
                .eq('userEmail', email.toLowerCase().trim());

            if (error) {
                return {
                    success: false,
                    message: `Error deleting user: ${error.message}`,
                };
            }

            // Clean up OTP
            otpStore.delete(email.toLowerCase().trim());

            return {
                success: true,
                message: 'User deleted successfully',
                user: existingUser as User,
            };
        } catch (error) {
            return {
                success: false,
                message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    }

    // Helper method to get all users (for debugging)
    static async getAllUsers(): Promise<User[]> {
        const {data, error} = await supabase
            .from('users1')
            .select('*');

        if (error) {
            console.error('Error fetching users:', error);
            return [];
        }

        return data as User[];
    }
}
