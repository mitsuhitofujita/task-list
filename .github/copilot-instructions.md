# Copilot Instructions


## Git Commit Message Guidelines

### 1. Commit Summary (1st Line)

* **Prefix** one of the following types, optionally with a scope in parentheses:

  * `feat`: A new feature
  * `fix`: A bug fix
  * `docs`: Documentation changes only
  * `style`: Changes that do **not** affect code meaning (formatting, whitespace, etc.)
  * `refactor`: Code changes that neither fix a bug nor add a feature
  * `perf`: Performance improvements
  * `test`: Adding or correcting tests
  * `chore`: Build process or auxiliary tool changes
  * *Optional*: `build`, `ci`, `revert`, etc. for release automation
* **Length**: ≤ 50 characters.
* **Tone**: Present-tense, imperative mood (e.g., *add support for X*).
* **Capitalization**: Do **not** capitalize the first word after the prefix.
* **Punctuation**: Do **not** end the line with a period.

Example:

```text
feat(ui): add dark-mode toggle
```

### 2. Blank Line

Insert a single blank line between the summary and the body.

### 3. Commit Body (≥ 2nd Line)

* Explain *what* and *why*; omit *how* if the diff is self-explanatory.
* Wrap lines at 72 characters for terminal readability.
* Reference issues or tickets when relevant:
  `Closes #123`, `Refs ABC-456`.
* For breaking changes, add a footer:

  ```text
  BREAKING CHANGE: removes deprecated v1 API
  ```

### 4. Additional Conventions (Optional but Recommended)

* **Package context**: Use a scope, e.g. `feat(api): …`, `fix(db): …`
* **Release automation**: Add distinct prefixes such as `build`, `ci`, `revert`
* **Readability**: Wrap body text at 72 characters
* **Impact clarity**: Include a `BREAKING CHANGE:` footer for any breaking changes
