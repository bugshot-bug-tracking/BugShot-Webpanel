#### 1.17.2 (2024-03-28)

#### 1.17.1 (2024-03-25)

##### Bug Fixes

* **Kanban:**  change how bugs are moved to not have a ruber band effect (aeb2b601)

##### Other Changes

* 30000/bugshot/web/webpanel (297f3ffc)
* 30000/bugshot/web/webpanel into staging (2b4afc91)

##### Refactors

* **Integrations:**  update jira integration to prevent future incompatibility (f60d0330)

### 1.17.0 (2024-03-18)

##### Chores

* **Code:**  delete unused/old components (9ab350c4)

##### New Features

* **Feature:**
  *  add option to include archived data when searching (33243a30)
  *  separate comments into public and internal ones (a1834a4e)
* **Usability:**
  *  add individual project access token favorite option on the settings page (fcd809d2)
  *  add experimental option in user settings and refactor code to be more clear (2298beec)
  *  add function to disable all email notifications with one checkbox (ef3fc5f4)
  *  fill mail automaticaly on register page if querry param present (9db60217)

##### Bug Fixes

* **UI:**
  *  hide extension install suggest modal if the user doesn't have an active license/trial (72de9749)
  *  fix image incorrect path for build (6f3c3e50)
* **API:**  update invitation model and property uses for redirecting after user accepts an invitation (b0bfe187)

##### Refactors

* **Feature:**  replace old way of determinig special users by env id list with DB user setting (296a6e2a)
* **UI:**
  *  change default order settings for companies and projects (bf16d7ed)
  *  replace bs-scroll with <n-scrollbar> (22e51953)

#### 1.16.3 (2024-03-06)

##### New Features

* **Tutorial:**  display message for users without extensions installed (db9aee6e)

#### 1.16.2 (2024-03-04)

##### Chores

* **Texts:**  add auto translated DE texts (cdd98cec)

##### New Features

* **Usability:**  save new line characters on bug comments (be535a0f)

##### Refactors

* **Package:**  replace old way of getting os and browser info with Bowser package (547c6f2d)

#### 1.16.1 (2024-02-26)

##### Bug Fixes

* **UI:**  fix scroll on payment/plan page (6f111142)

### 1.16.0 (2024-02-26)

##### Refactors

* **Feature:**  refactor kanban filter functionality (7a210fc6)
* **UI:**  change subscription page component to show both monthly and yearly subscriptions side by side (78ce404e)

### 1.15.0 (2024-02-19)

##### New Features

* **Project:**  add multiple guest tokens with descriptions to a project (8dd5c6cb)

#### 1.14.2 (2024-02-12)

##### Bug Fixes

* **Code:**  fix generation of access token not updateing the UI (8a1b5c25)

#### 1.14.1 (2024-02-12)

##### New Features

* **Events:**  live update the kanban bugs member list (8f7819e8)

##### Bug Fixes

* **API:**  change access token system (edb7ddc8)

##### Refactors

* **Links:**  update terms of service and privacy policy links (eb2350a7)

### 1.14.0 (2024-02-05)

##### New Features

* **Usability:**
  *  add moving of groups between organizations (a588d14a)
  *  add role dot before project/group name (a9d5c466)
  *  add email notification settings page (bb468eca)

##### Bug Fixes

* **Texts:**  add missing en translation for email notifications (de0a6150)

#### 1.13.4 (2024-01-29)

##### Bug Fixes

* **UI:**  fis selected org role tag not properly positioned (57ea3b7c)

#### 1.13.3 (2024-01-22)

##### New Features

* **UI:**  add role tag after organization name in the organization switcher (707675b5)
* **Usability:**  improve suggestions on coment tag, invite modal and assignable bug users to contain users from group and org (0c9b5364)

#### 1.13.2 (2024-01-17)

##### Bug Fixes

* **UI:**  fix bugs not showing in the correct order (edcb70a5)

#### 1.13.1 (2024-01-17)

##### Bug Fixes

* **Package:**  fix build on kasserver not working, related to rollup upgrade in ecfdbefe1cb585976a4de60f167056cbeb528ace (130d8da3)

### 1.13.0 (2023-12-22)

##### New Features

* **Usability:**  add filters to kanban board (9d234ee6)
* **Texts:**
  *  add new extensions texts (d71cffeb)
  *  update display logic for bug creator to handle guest users (ee2352ba)

##### Refactors

* **UI:**  WEBPANEL#65 change client texts to include browser name and modify cursor icon on guest token copy button (be101dac)

#### 1.12.6 (2023-12-15)

##### Chores

*  add generate-changelog to project dependencies (ada71283)
* **Package:**  update node to v20 and vite to v5 (ecfdbefe)

#### 1.12.5 (2023-12-13)

##### New Features

* **Usability:**  add resend email verification option at login (4fc0e297)

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
