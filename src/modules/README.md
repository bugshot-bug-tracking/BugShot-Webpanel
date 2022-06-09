## Modules

A custom user module system. Place a `.ts` file with the following template, it will be installed automatically.

```js
import { UserModule } from '~/types'

export const install: UserModule = ({ app, router }) => {
	// do something
};
```
