const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf-8');

// Add import
code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport liff from '@line/liff';");

// Inside PublicMapApp
const hookToInsert = `
  // LINE Profile State
  const [lineProfile, setLineProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;
    liff.init({ liffId: '2011462282-d9h0l139' }).then(() => {
      if (!isMounted) return;
      if (liff.isLoggedIn()) {
        liff.getProfile().then(profile => {
          if (isMounted) setLineProfile(profile);
        }).catch(err => console.error('LIFF getProfile error', err));
      } else if (liff.isInClient()) {
        // LINEアプリ内で開いている場合は自動ログイン
        liff.login();
      }
    }).catch(err => console.error('LIFF init error', err));
    return () => { isMounted = false; };
  }, []);
`;

code = code.replace("function PublicMapApp() {\n  useNoIndex();\n  const { teamId } = useParams();\n  const navigate = useNavigate();", "function PublicMapApp() {\n  useNoIndex();\n  const { teamId } = useParams();\n  const navigate = useNavigate();\n" + hookToInsert);

// Add to newPin
const insertReplacement = `    const newPin = {
      team_id: teamId,
      lat: newLat,
      lng: newLng,
      type: actionType,
      action_count: initCount,
      // LINE名があれば記録する
      created_by: lineProfile ? lineProfile.displayName : 'スタッフ'
    };`;
code = code.replace(`    const newPin = {
      team_id: teamId,
      lat: newLat,
      lng: newLng,
      type: actionType,
      action_count: initCount
    };`, insertReplacement);

fs.writeFileSync('src/App.jsx', code);
