#### 1.12.4 (2023-12-13)

##### New Features

* **UI:**  add integrations redirect button on project page dropdown list (60f88648)

#### 1.12.3 (2023-12-13)

##### Bug Fixes

* **Integrations:**  fix wrong project in jira store when constantly moving between projects (f6496ebe)

#### 1.12.2 (2023-12-06)

##### New Features

* **UI:**  edit flag checks and include admin verification (7453f8bb)
* **Integrations:**  save jira bug issuetype id when selecting project (726f263f)

### 1.12.0 (2023-12-06)

##### Bug Fixes

* **UI:**  disable bug movement if user is Client (ccd7c67c)

##### New Features

* **integrations:**  add jira integration (a88d39dc)

#### 1.11.2 (2023-10-18)

##### Refactors

* **Texts:**  update welcome page and plan texts (974b8fed)

#### 1.11.1 (2023-10-06)

##### Bug Fixes

* **Texts:**  wrong creator name for bugs created using a token (4c6ca8d8)

### 1.11.0 (2023-10-06)

##### New Features

* **project:**  add extension guest access via token (0bac928b)

#### 1.10.3 (2023-09-29)

##### Bug Fixes

* **API:**  change settings values available in the api (bbda049c)

#### 1.10.2 (2023-09-28)

##### Refactors

* **pages:**
  *  move application and extension links to separate page (1e1c31bf)
  *  change organization plan page to use the new plan cards (c16e1c27)

#### 1.10.1 (2023-09-28)

##### Bug Fixes

* **API:**  update setting ids (6a0185a9)

### 1.10.0 (2023-09-25)

##### New Features

* **tutorial:**  implement overview tour for new users (015829d3)
* **pages:**  change the "/new" page with a new "/dashboard/welcome" page (0b97d033)
* **usability:**
  *  save user preferences on server (83b7dc40)
  *  clicking the "Group" on the group navigation bar will redirect to the organization main page (38c36346)
  *  sync group ordering with the left menu on the dashboard/all page (c89adeed)

##### Bug Fixes

* **code:**  fix typo (bfbf652b)

##### Refactors

* **code:**  change prop types for AssignmentTable list (7e152295)
* **UI:**  change settings icon (9bab96e1)

### 1.9.0 (2023-09-17)

##### Continuous Integration

* **changelog:**  ignore chores in changelog (b77b00b5)

##### New Features

* **usability:**  add ability to move projects between groups (5dd7b150)
* **Pages:**  add "all" dashboard page for displaying all the projects and groups (3cd6d070)

##### Refactors

* **banners:**  make trial banner to be hidden if the expiration is >60 days (was 400) (04ccba80)

#### 1.8.1 (2023-09-07)

##### Bug Fixes

* **API:**  change the way project/company settings are updated (d1b5a1e3)
* **texts:**
  *  change german text when confirming bug deletion (238ffb36)
  *  make success and error text after loading modal be centered (57556020)

### 1.8.0 (2023-09-05)

##### Other Changes

-   enable bug moving and approval requests for everyone (13568af0)
-   enable time estimation on a bug for everyone (2fbce7f1)
-   fix notification not live updating (28aed932)
-   Add safari link to the available Client list (41883ae7)
-   disable extension suggesting (f88097a3)
-   update registration verification email resend to use email instead of id (b4194dd9)
-   enable assign to multiple projects when inviting to a group (a0a521ff)
-   enable inviting to a project from Groups invite modal (7c09441f)
-   add tips for installing extension in case it's not present (8fd13cef)
-   update modal close icon (img->svg) (d07bc42e)
-   replace extension links with env variables (c4e91eea)
-   add notifications support (6eb356e9)
-   add @vueuse/core to autoimport (ac7589fa)
-   add existing email verification at first registration step (ef246c06)
-   minor fixes (be32bb56)
-   remove "deprecated" folder (c7a8f597)
