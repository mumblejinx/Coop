# Security Specification - CIS: PLAYER_ONE_COOP

## 1. Data Invariants
- A reflection cannot exist without a valid user ID.
- Users can only read and write their own profile and reflections.
- `xp` and `level` must be numbers.
- `theme` must be one of the 4 allowed types.
- Timestamps must be valid and `serverTimestamp` must match `request.time`.

## 2. The "Dirty Dozen" Payloads (Attack Vectors)
1. **Identity Spoof**: Try to create a profile with a different `userId`.
2. **Ghost Update**: Try to update someone else's `xp`.
3. **Invalid Theme**: Try to save a reflection with theme 'evil'.
4. **ID Poisoning**: Inject 2MB string as `reflectionId`.
5. **Time Travel**: Manually set `serverTimestamp` to year 2099.
6. **Negative XP**: Set `xp` to -1000.
7. **Bypass Creator**: Write a reflection to another user's subcollection.
8. **Shadow Field**: Add `isAdmin: true` to a user profile.
9. **Bulk Read**: Attempt to list all users without a specific UID filter.
10. **Type Swap**: Set `reflections` as a string instead of a collection.
11. **Immortal Overwrite**: Try to change `createdAt` on a user profile.
12. **Denial of Wallet**: Send 1MB string in `input` field.

## 3. Test Runner
(I will implement `firestore.rules.test.ts` after drafting rules)
