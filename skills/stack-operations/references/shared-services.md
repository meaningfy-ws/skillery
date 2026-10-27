# Shared services and their consumers

A shared service is one stack that other stacks or people use: a database, a graph store, an object
store. Its failure or change reaches every consumer, so the provider keeps a contract:

1. **The provider's README lists its consumers** (the Consumers section of the stack template): who,
   which service, which account, how it is checked.
2. **One least-privilege account per consumer.** Never a shared admin account; removing one consumer
   then breaks nobody else. How the credential is created and stored is owned by
   `infrastructure-security`.
3. **Private only.** The service is published on the private address only (rule S7), and consumers
   point at that address.
4. **A provider deploy checks its consumers recover.** After `up --wait`, run the consumers' smoke
   scenarios or the check named in the Consumers table.
5. **A change to the provider names its consumers** in the PR, and the consent card says who notices.

Adding a consumer: add its row to the provider's README, create its account, open the private access,
and add its check, in one change.
