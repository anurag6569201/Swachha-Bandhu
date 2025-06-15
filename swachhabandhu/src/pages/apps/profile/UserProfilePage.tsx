// src/pages/apps/profile/UserProfilePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../Api';
import { User, Mail, Phone, Save, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

type FormInputs = {
    full_name: string;
    phone_number: string;
    profile_picture?: FileList;
};

const UserProfilePage: React.FC = () => {
    const { user, isLoading: authLoading, refetchUser } = useAuth(); // Assuming refetchUser exists
    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormInputs>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            reset({
                full_name: user.full_name,
                phone_number: user.phone_number || '',
            });
            setImagePreview(user.profile_picture_url);
        }
    }, [user, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsSubmitting(true);
        setApiError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append('full_name', data.full_name);
        formData.append('phone_number', data.phone_number);
        if (data.profile_picture && data.profile_picture.length > 0) {
            formData.append('profile_picture', data.profile_picture[0]);
        }

        try {
            await apiClient.put('/auth/profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccessMessage('Profile updated successfully!');
            refetchUser(); // Refetch user data to update avatar everywhere
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setApiError(err.response?.data?.detail || 'Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    if (!user) {
        return <div className="text-center p-10">Could not load user data.</div>
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-500 mb-8">Update your personal information here.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className="relative">
                        <img
                            src={imagePreview || `https://ui-avatars.com/api/?name=${user?.full_name}&background=random&size=128`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                        />
                        <input
                            type="file"
                            {...register('profile_picture')}
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all"
                        >
                            <Camera size={16} />
                        </button>
                    </div>

                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            {...register('full_name', { required: 'Full name is required' })}
                            placeholder="Full Name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>}
                    </div>
                    
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email address cannot be changed.</p>
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            {...register('phone_number')}
                            placeholder="Phone Number (Optional)"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {apiError && <p className="text-red-500 text-center">{apiError}</p>}
                    {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || !isDirty}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
                        >
                            <Save size={20} />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UserProfilePage;