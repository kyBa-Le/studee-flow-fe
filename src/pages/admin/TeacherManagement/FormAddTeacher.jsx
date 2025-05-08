"use client"

import React, { useState } from "react"
import "./FormAddTeacher.css"
import { createUser } from "../../../services/UserService"

export function FormAddTeacher({onCancel}) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {
            full_name: formData.fullName,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword,
            role: "teacher"
        };
        try {
            let response = await createUser(user);
            console.log(response);
            onCancel(true);
        } catch (error) {
            if (error.status == 422) {
                setEmailError(error.response.data.message);
            }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h1 className="form-title">Create teacher</h1>
                <div className="form-group">
                    <label htmlFor="fullName">Full name</label>
                    <input
                        id="fullName"
                        name="fullName"
                        placeholder="Enter teacher name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="error">{emailError}</div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-container">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="password-toggle"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="error">{error}</div>

                <div className="button-group">
                    <button type="button" onClick={ onCancel } className="cancel-button">
                        Cancel
                    </button>
                    <button type="submit" className="create-button">
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}
