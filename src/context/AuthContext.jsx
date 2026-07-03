import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserByEmail, addUser, hashPassword } from '../data/db';

const AuthContext = createContext();

// Helper to encode Base64 Url Safe strings
function base64UrlEncode(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Helper to decode Base64 Url Safe strings
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
}

// Generate client-side mock JWT token with signature
async function generateMockJWT(payload) {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const payloadStr = JSON.stringify({ 
    ...payload, 
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000) // 24 hours expiry
  });
  
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payloadStr);
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  
  // Use standard Web Crypto to sign the token using SHA-256 and a secret key client-side
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureInput + "_secret_DJSK_2026_key");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const encodedSignature = base64UrlEncode(hashArray.map(b => String.fromCharCode(b)).join(''));
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

// Verify client-side mock JWT token signature & expiry
async function verifyMockJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureInput + "_secret_DJSK_2026_key");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedSignature = base64UrlEncode(hashArray.map(b => String.fromCharCode(b)).join(''));
    
    if (encodedSignature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return null; // Expired
    }
    
    return payload;
  } catch (err) {
    console.error('Token verification error:', err);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('djsk_jwt_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      if (token) {
        const payload = await verifyMockJWT(token);
        if (payload) {
          setUser({
            email: payload.email,
            name: payload.name,
            role: payload.role,
            phone: payload.phone
          });
        } else {
          // Token is invalid or expired
          localStorage.removeItem('djsk_jwt_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadSession();
  }, [token]);

  // Log in user
  const login = async (email, password) => {
    const dbUser = await getUserByEmail(email);
    if (!dbUser) {
      throw new Error('User not found (उपयोगकर्ता नहीं मिला)');
    }

    const hashedInput = await hashPassword(password);
    if (dbUser.password !== hashedInput) {
      throw new Error('Incorrect password (गलत पासवर्ड)');
    }

    // Generate mock JWT
    const payload = {
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      phone: dbUser.phone
    };
    const jwtToken = await generateMockJWT(payload);
    
    localStorage.setItem('djsk_jwt_token', jwtToken);
    setToken(jwtToken);
    setUser({
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      phone: dbUser.phone
    });

    return dbUser;
  };

  // Register customer
  const register = async (name, email, phone, password) => {
    const hashedPassword = await hashPassword(password);
    const newUser = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phone,
      role: 'customer', // Always customer by default for signups
      createdAt: new Date().toISOString()
    };

    await addUser(newUser);
    
    // Automatically log in
    return login(email, password);
  };

  // Sign out user
  const logout = () => {
    localStorage.removeItem('djsk_jwt_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
