namespace SimpleNotes.Api.Core.Security
{
    public static class EncryptionUtil
    {
        /// <summary>
        /// Hashes a plain text password using the BCrypt algorithm.
        /// </summary>
        /// <param name="plainText">The plain text password.</param>
        /// <returns>The BCrypt hashed password.</returns>
        public static string Encrypt(string plainText)
        {
            var encryptedPassword = BCrypt.Net.BCrypt.HashPassword(plainText);
            return encryptedPassword;
        }

        /// <summary>
        /// Verifies whether a plain text password matches a BCrypt hash.
        /// </summary>
        /// <param name="plainText">The plain text password.</param>
        /// <param name="cipherText">The stored BCrypt hash.</param>
        /// <returns>True if the password is valid; otherwise, false.</returns>
        public static bool IsValidPassword(string plainText, string cipherText)
        {
            var isValid = BCrypt.Net.BCrypt.Verify(plainText, cipherText);
            return isValid;
        }
    }
}
