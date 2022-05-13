// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.less';
import {UsersList} from './list/list';
import { ThemeProvider } from '@ui5/webcomponents-react';
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme';
import '@ui5/webcomponents/dist/Assets';
import '@ui5/webcomponents-fiori/dist/Assets';
setTheme('sap_fiori_3_dark');

export function App() {
  return (
    <ThemeProvider>
      <div className="ui5-content-density-compact">
        <UsersList />
      </div>
    </ThemeProvider>
  );
}

export default App;
