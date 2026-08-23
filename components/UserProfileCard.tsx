// UserProfileCard.tsx
export interface UserProfileCardProps {
  username: string;
  email: string;
  role: "admin" | "user";
  isAccountLocked?: boolean;
  profileUrl: string;
}

export function UserProfileCard({
  username,
  email,
  role,
  isAccountLocked = false,
  profileUrl,
}: UserProfileCardProps) {
  return (
    <div className="profile-card">
      <h1>User Profile</h1>
      <h2>{username}</h2>

      <div className="form-group">
        <label htmlFor="email-input">Email Address</label>
        <input
          id="email-input"
          type="email"
          defaultValue={email}
          placeholder="Enter user email"
        />
      </div>

      <p>Account Type: {role}</p>

      {isAccountLocked && (
        <p role="alert">Warning: This account is currently locked</p>
      )}

      <a href={profileUrl}>View Full Profile</a>

      <button type="button" disabled={isAccountLocked}>
        Edit Profile
      </button>
    </div>
  );
}