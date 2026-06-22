const state = {
  files: [],
  scope: "novel",
  currentPath: "",
  baseHash: "",
  savedContent: "",
  dirty: false,
  showingPreview: false,
  snapshotTimer: null,
  searchHit: null,
  selectedHistory: null,
  locale: "en-US",
  pendingLocale: "",
  theme: "light",
  accent: "crimson",
  lineCount: 0,
  activeLine: 1,
  lineMetricsKey: "",
  viewPrefs: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 17,
    lineHeight: 1.85,
  },
};

const FONT_SIZE_MIN = 13;
const FONT_SIZE_MAX = 28;
const PUBLIC_VERSION = "0.2.23";
const APP_VERSION = `Four Seasons v${PUBLIC_VERSION}`;
const UPDATE_CHECK_URLS = [
  "/version.json",
  "https://raw.githubusercontent.com/shenqiu9355/fourseasons-markdown-editor/main/version.json",
];
const UPDATE_HOME_URL = "https://github.com/shenqiu9355/fourseasons-markdown-editor";
const VIEW_PREF_KEY = "fourSeasonsEditorViewPrefs";
const THEME_KEY = "fourSeasonsEditorTheme";
const ACCENT_KEY = "fourSeasonsEditorAccent";
const LOCALE_KEY = "fourSeasonsEditorLocale";
const ACCENTS = {
  crimson: { color: "#e04444", soft: "rgba(224, 68, 68, 0.2)", selection: "rgba(224, 68, 68, 0.38)" },
  amber: { color: "#d48806", soft: "rgba(212, 136, 6, 0.2)", selection: "rgba(212, 136, 6, 0.38)" },
  jade: { color: "#2fa866", soft: "rgba(47, 168, 102, 0.2)", selection: "rgba(47, 168, 102, 0.38)" },
  sky: { color: "#2f7fe5", soft: "rgba(47, 127, 229, 0.2)", selection: "rgba(47, 127, 229, 0.38)" },
  violet: { color: "#8f55e6", soft: "rgba(143, 85, 230, 0.2)", selection: "rgba(143, 85, 230, 0.38)" },
};
const LOCALE_POLICY_KEY_PREFIX = "fourSeasons.localePolicy.oneChinaAcknowledged.v1";
const RESTRICTED_LOCALES = new Set(["zh-CN", "zh-Hant", "ja-JP"]);
const LOCALE_POLICY_PHRASES = {
  "zh-CN": "台湾属于中国，世界上只有一个中国。",
  "zh-Hant": "臺灣屬於中國，世界上只有一個中國。",
  "ja-JP": "台湾は中国の一部であり、世界に中国は一つだけです。",
};
const I18N = {
  "zh-CN": {
    appTitle: "四季 Markdown 编辑器",
    loading: "加载中...",
    refreshTitle: "刷新章节",
    scope: "范围",
    scopeNovel: "正文",
    scopeProject: "本书项目",
    scopeWorld: "世界库",
    openPath: "打开路径",
    openPathPlaceholder: "粘贴 .md 绝对路径或库内路径",
    open: "打开",
    filterFiles: "筛选文件",
    filterFilesPlaceholder: "章节名 / 路径",
    contentSearch: "全文搜索",
    contentSearchPlaceholder: "搜索当前范围内 Markdown",
    search: "搜索",
    notSearched: "未搜索",
    noResults: "没有命中",
    resultsCount: "{count} 处命中",
    searching: "搜索中...",
    activityLog: "操作记录",
    createFolder: "新建文件夹",
    createFolderTitle: "在当前范围内新建文件夹",
    createFolderPrompt: "输入新文件夹相对路径，例如：drafts/notes",
    createFolderDone: "已创建文件夹：{path}",
    renameFile: "改名",
    renameFileTitle: "更改当前文件名",
    renamePrompt: "输入新的 Markdown 文件名",
    renameDone: "已改名：{path}",
    renameUnsaved: "请先保存当前改动，再改文件名。",
    noFileTitle: "未选择章节",
    noFilePath: "从左侧选择正文文件",
    localeTitle: "界面语言",
    themeSwitch: "主题切换",
    lightTheme: "白色主题",
    darkTheme: "黑色主题",
    eyeTheme: "护眼主题",
    reloadFile: "重载文件",
    reloadTitle: "放弃当前未保存内容，重新读取磁盘文件",
    history: "历史",
    historyTitle: "查看保存前自动备份",
    check: "检查",
    checkTitle: "检查标点、括号和基础格式问题",
    viewChanges: "查看改动",
    viewChangesTitle: "只查看当前改动，不保存",
    save: "保存",
    font: "字体",
    fontSize: "字号",
    lineHeight: "行距",
    formatLabel: "正文显示与 Markdown 工具",
    boldTitle: "粗体：用 ** 包住选中文字",
    italicTitle: "斜体：用 * 包住选中文字",
    h1Title: "一级标题",
    h2Title: "二级标题",
    quoteTitle: "引用",
    listTitle: "列表",
    orderedListTitle: "编号列表",
    inlineCodeTitle: "行内代码",
    strikeTitle: "删除线",
    linkTitle: "链接",
    hrTitle: "分隔线",
    boldPlaceholder: "粗体文字",
    italicPlaceholder: "斜体文字",
    codePlaceholder: "代码",
    strikePlaceholder: "删除文字",
    linkTextPlaceholder: "链接文字",
    editorPlaceholder: "选择一章开始写。",
    previewMarkdown: "预览 Markdown",
    returnEdit: "返回编辑",
    saved: "已保存",
    unsaved: "未保存",
    unloaded: "未加载",
    chars: "{count} 字",
    cursor: "行 {line}，列 {col}",
    modifiedAt: "修改时间 {mtime}",
    reloadConfirm: "当前章节有未保存改动，确定重读磁盘文件吗？",
    switchConfirm: "当前章节有未保存改动，确定切换吗？",
    conflictAlert: "磁盘文件已经变化，编辑器拒绝覆盖。请重读后再处理。",
    diffTitle: "保存前确认",
    diffSummaryDefault: "当前改动",
    noChanges: "没有改动。",
    noChangesSummary: "当前内容与磁盘文件一致",
    cancel: "取消",
    close: "关闭",
    promptTitle: "输入",
    promptConfirm: "确认",
    promptRequired: "请输入内容。",
    confirmSave: "确认保存",
    backupDone: "已备份：{backup}",
    backupDiffDone: "已备份：{backup}；Diff：{diff}",
    draftRestored: "已恢复未保存草稿，保存前请查看改动。",
    historyDialogTitle: "历史版本",
    historyDialogSubtitle: "保存前自动备份",
    historyChoose: "选择一个历史版本查看差异。",
    historyEmpty: "当前文件还没有保存前备份。",
    historyCount: "{count} 个保存前版本",
    historyLoading: "正在读取历史版本...",
    historySame: "这个历史版本与当前磁盘文件一致。",
    restoreDraft: "载入为草稿",
    restoreConfirm: "当前还有未保存改动，确定用历史版本覆盖编辑框吗？",
    restoredHistory: "已载入历史版本：{stamp}。保存前请查看改动。",
    unknownTime: "未知时间",
    checkDialogTitle: "文本检查",
    checkDialogSubtitle: "标点、括号和基础格式",
    checkClean: "暂未发现基础问题",
    checkCleanBody: "没有发现重复标点、括号/引号不配对、连续空格等基础问题。",
    checkCount: "{count} 个可能问题，仅提示，不自动修改",
    checkDuplicatePunctuation: "重复标点",
    checkHalfPunctuation: "半角标点",
    checkSpace: "空格",
    checkBracket: "括号/引号",
    issueDuplicate: "连续出现了「{value}」",
    issueHalfPunctuation: "中文之间疑似使用了半角标点",
    issueFullWidthSpace: "发现全角空格",
    issueMultiSpace: "发现连续空格",
    issueExtraClose: "可能多了一个「{value}」",
    issueMissingClose: "可能缺少对应的「{value}」",
    issueEmptyLine: "空行",
    activityDialogTitle: "操作记录",
    activityDialogSubtitle: "打开、搜索、查看改动、保存与备份记录",
    noActivity: "暂无记录。",
    searchHit: "搜索命中：第 {line} 行",
    localePolicyTitle: "语言包确认",
    localePolicySubtitle: "首次启用此语言包前需要确认作者声明",
    localePolicyIntro: "请照着输入下方官方标准短语。该确认只保存在本机，不上传，不写入操作记录。",
    localePolicyPlaceholder: "输入官方标准短语",
    localePolicyCopy: "复制短语",
    localePolicyCancel: "取消",
    localePolicyConfirm: "确认并启用",
    updateAvailable: "发现新版 {version}",
    updateOpen: "打开 GitHub 更新页",
  localePolicyError: "输入内容必须与官方标准短语一致。",
  },
  "en-US": {
    appTitle: "Four Seasons Markdown Editor",
    loading: "Loading...",
    refreshTitle: "Refresh files",
    scope: "Scope",
    scopeNovel: "Documents",
    scopeProject: "Project",
    scopeWorld: "Workspace",
    openPath: "Open path",
    openPathPlaceholder: "Paste a .md absolute or workspace path",
    open: "Open",
    filterFiles: "Filter files",
    filterFilesPlaceholder: "Title / path",
    contentSearch: "Full-text search",
    contentSearchPlaceholder: "Search Markdown in current scope",
    search: "Search",
    notSearched: "Not searched",
    noResults: "No matches",
    resultsCount: "{count} matches",
    searching: "Searching...",
    activityLog: "Activity",
    createFolder: "New Folder",
    createFolderTitle: "Create a folder in the current scope",
    createFolderPrompt: "Enter a relative folder path, for example: volume-1/notes",
    createFolderDone: "Created folder: {path}",
    renameFile: "Rename",
    renameFileTitle: "Rename the current file",
    renamePrompt: "Enter the new Markdown file name",
    renameDone: "Renamed: {path}",
    renameUnsaved: "Save current changes before renaming the file.",
    noFileTitle: "No file selected",
    noFilePath: "Choose a Markdown file from the left",
    localeTitle: "Interface language",
    themeSwitch: "Theme",
    lightTheme: "Light theme",
    darkTheme: "Dark theme",
    eyeTheme: "Comfort theme",
    reloadFile: "Reload File",
    reloadTitle: "Discard unsaved editor content and read the file from disk",
    history: "History",
    historyTitle: "View automatic pre-save backups",
    check: "Check",
    checkTitle: "Check punctuation, brackets, and basic formatting",
    viewChanges: "View Changes",
    viewChangesTitle: "Preview current changes without saving",
    save: "Save",
    font: "Font",
    fontSize: "Size",
    lineHeight: "Line",
    formatLabel: "Display and Markdown tools",
    boldTitle: "Bold: wrap selected text with **",
    italicTitle: "Italic: wrap selected text with *",
    h1Title: "Heading 1",
    h2Title: "Heading 2",
    quoteTitle: "Quote",
    listTitle: "List",
    orderedListTitle: "Numbered list",
    inlineCodeTitle: "Inline code",
    strikeTitle: "Strikethrough",
    linkTitle: "Link",
    hrTitle: "Horizontal rule",
    boldPlaceholder: "bold text",
    italicPlaceholder: "italic text",
    codePlaceholder: "code",
    strikePlaceholder: "deleted text",
    linkTextPlaceholder: "link text",
    editorPlaceholder: "Choose a file to start writing.",
    previewMarkdown: "Preview Markdown",
    returnEdit: "Back to Edit",
    saved: "Saved",
    unsaved: "Unsaved",
    unloaded: "No file",
    chars: "{count} chars",
    cursor: "Line {line}, col {col}",
    modifiedAt: "Modified {mtime}",
    reloadConfirm: "This file has unsaved changes. Reload from disk anyway?",
    switchConfirm: "This file has unsaved changes. Switch anyway?",
    conflictAlert: "The file changed on disk. The editor refused to overwrite it. Reload before continuing.",
    diffTitle: "Review Before Saving",
    diffSummaryDefault: "Current changes",
    noChanges: "No changes.",
    noChangesSummary: "Current content matches the disk file",
    cancel: "Cancel",
    close: "Close",
    promptTitle: "Input",
    promptConfirm: "Confirm",
    promptRequired: "Please enter a value.",
    confirmSave: "Confirm Save",
    backupDone: "Backup: {backup}",
    backupDiffDone: "Backup: {backup}; Diff: {diff}",
    draftRestored: "Unsaved draft restored. Review changes before saving.",
    historyDialogTitle: "History",
    historyDialogSubtitle: "Automatic pre-save backups",
    historyChoose: "Select a history version to view the diff.",
    historyEmpty: "No pre-save backups for this file yet.",
    historyCount: "{count} pre-save versions",
    historyLoading: "Loading history version...",
    historySame: "This history version matches the current disk file.",
    restoreDraft: "Load as Draft",
    restoreConfirm: "There are unsaved changes. Replace the editor draft with this history version?",
    restoredHistory: "Loaded history version: {stamp}. Review changes before saving.",
    unknownTime: "Unknown time",
    checkDialogTitle: "Text Check",
    checkDialogSubtitle: "Punctuation, brackets, and basic formatting",
    checkClean: "No basic issues found",
    checkCleanBody: "No repeated punctuation, unmatched brackets/quotes, or repeated spaces were found.",
    checkCount: "{count} possible issues. Suggestions only; no automatic edits.",
    checkDuplicatePunctuation: "Repeated punctuation",
    checkHalfPunctuation: "Half-width punctuation",
    checkSpace: "Spacing",
    checkBracket: "Brackets/quotes",
    issueDuplicate: "Repeated punctuation: {value}",
    issueHalfPunctuation: "Half-width punctuation appears between Chinese characters",
    issueFullWidthSpace: "Full-width space found",
    issueMultiSpace: "Repeated spaces found",
    issueExtraClose: "Possible extra closing mark: {value}",
    issueMissingClose: "Possibly missing closing mark: {value}",
    issueEmptyLine: "Empty line",
    activityDialogTitle: "Activity",
    activityDialogSubtitle: "Open, search, view changes, save, and backup records",
    noActivity: "No records yet.",
    searchHit: "Search hit: line {line}",
    localePolicyTitle: "Language Pack Acknowledgement",
    localePolicySubtitle: "This language pack requires a one-time author acknowledgement",
    localePolicyIntro: "Type the official phrase below exactly. This confirmation stays on this computer only. It is not uploaded or written to the activity log.",
    localePolicyPlaceholder: "Type the official phrase",
    localePolicyCopy: "Copy Phrase",
    localePolicyCancel: "Cancel",
    localePolicyConfirm: "Acknowledge and Enable",
    localePolicyError: "The input must match the official phrase exactly.",
    updateAvailable: "Update {version} available",
    updateOpen: "Open GitHub update page",
  },
};
I18N["zh-Hant"] = {
  ...I18N["zh-CN"],
  appTitle: "四季 Markdown 編輯器",
  loading: "載入中...",
  scopeNovel: "正文",
  scopeProject: "本書項目",
  scopeWorld: "世界庫",
  openPathPlaceholder: "貼上 .md 絕對路徑或庫內路徑",
  noFileTitle: "未選擇章節",
  noFilePath: "從左側選擇正文檔案",
  reloadFile: "重載檔案",
  history: "歷史",
  check: "檢查",
  viewChanges: "查看改動",
  saved: "已儲存",
  unsaved: "未儲存",
  unloaded: "未載入",
  diffTitle: "儲存前確認",
  confirmSave: "確認儲存",
  historyDialogTitle: "歷史版本",
  restoreDraft: "載入為草稿",
  checkDialogTitle: "文本檢查",
  activityDialogTitle: "操作記錄",
  orderedListTitle: "編號列表",
  inlineCodeTitle: "行內程式碼",
  strikeTitle: "刪除線",
  linkTitle: "連結",
  hrTitle: "分隔線",
  boldPlaceholder: "粗體文字",
  italicPlaceholder: "斜體文字",
  codePlaceholder: "程式碼",
  strikePlaceholder: "刪除文字",
  linkTextPlaceholder: "連結文字",
  localePolicyTitle: "語言包確認",
  localePolicySubtitle: "首次啟用此語言包前需要確認作者聲明",
  localePolicyIntro: "請照著輸入下方官方標準短語。該確認只保存在本機，不上傳，不寫入操作記錄。",
  localePolicyPlaceholder: "輸入官方標準短語",
  localePolicyCopy: "複製短語",
  localePolicyConfirm: "確認並啟用",
  localePolicyError: "輸入內容必須與官方標準短語一致。",
};
I18N["ja-JP"] = {
  ...I18N["en-US"],
  appTitle: "Four Seasons Markdown Editor",
  loading: "読み込み中...",
  scope: "範囲",
  scopeNovel: "本文",
  scopeProject: "プロジェクト",
  scopeWorld: "ワークスペース",
  openPath: "パスを開く",
  openPathPlaceholder: ".md の絶対パスまたはワークスペース内パスを貼り付け",
  open: "開く",
  filterFiles: "ファイルを絞り込む",
  filterFilesPlaceholder: "章名 / パス",
  contentSearch: "全文検索",
  contentSearchPlaceholder: "現在の範囲の Markdown を検索",
  search: "検索",
  notSearched: "未検索",
  noResults: "一致なし",
  resultsCount: "{count} 件一致",
  searching: "検索中...",
  activityLog: "操作記録",
  noFileTitle: "ファイル未選択",
  noFilePath: "左側から Markdown ファイルを選択",
  localeTitle: "表示言語",
  themeSwitch: "テーマ",
  lightTheme: "ライトテーマ",
  darkTheme: "ダークテーマ",
  eyeTheme: "目に優しいテーマ",
  reloadFile: "再読み込み",
  history: "履歴",
  check: "チェック",
  viewChanges: "変更を確認",
  save: "保存",
  font: "フォント",
  fontSize: "サイズ",
  lineHeight: "行間",
  orderedListTitle: "番号付きリスト",
  inlineCodeTitle: "インラインコード",
  strikeTitle: "取り消し線",
  linkTitle: "リンク",
  hrTitle: "区切り線",
  boldPlaceholder: "太字テキスト",
  italicPlaceholder: "斜体テキスト",
  codePlaceholder: "コード",
  strikePlaceholder: "削除テキスト",
  linkTextPlaceholder: "リンク文字",
  editorPlaceholder: "ファイルを選んで書き始めます。",
  previewMarkdown: "Markdown プレビュー",
  returnEdit: "編集に戻る",
  saved: "保存済み",
  unsaved: "未保存",
  unloaded: "未読み込み",
  chars: "{count} 字",
  cursor: "{line} 行、{col} 列",
  diffTitle: "保存前の確認",
  cancel: "キャンセル",
  close: "閉じる",
  confirmSave: "保存を確定",
  historyDialogTitle: "履歴バージョン",
  restoreDraft: "下書きとして読み込む",
  checkDialogTitle: "テキストチェック",
  activityDialogTitle: "操作記録",
  localePolicyTitle: "言語パック確認",
  localePolicySubtitle: "この言語パックを初めて有効にする前に作者声明の確認が必要です",
  localePolicyIntro: "下の公式標準フレーズをそのまま入力してください。この確認はこの端末内にのみ保存され、アップロードも操作記録への書き込みも行いません。",
  localePolicyPlaceholder: "公式標準フレーズを入力",
  localePolicyCopy: "フレーズをコピー",
  localePolicyCancel: "キャンセル",
  localePolicyConfirm: "確認して有効化",
  localePolicyError: "入力内容は公式標準フレーズと完全に一致する必要があります。",
};
I18N["fr-FR"] = {
  ...I18N["en-US"],
  loading: "Chargement...",
  refreshTitle: "Actualiser les fichiers",
  scope: "Portee",
  scopeNovel: "Documents",
  scopeProject: "Projet",
  scopeWorld: "Espace de travail",
  openPath: "Ouvrir un chemin",
  open: "Ouvrir",
  filterFiles: "Filtrer les fichiers",
  filterFilesPlaceholder: "Titre / chemin",
  contentSearch: "Recherche plein texte",
  search: "Rechercher",
  notSearched: "Pas encore recherche",
  noResults: "Aucun resultat",
  resultsCount: "{count} resultats",
  searching: "Recherche...",
  activityLog: "Activite",
  noFileTitle: "Aucun fichier selectionne",
  localeTitle: "Langue de l'interface",
  themeSwitch: "Theme",
  reloadFile: "Recharger",
  history: "Historique",
  check: "Verifier",
  viewChanges: "Voir les changements",
  save: "Enregistrer",
  font: "Police",
  fontSize: "Taille",
  lineHeight: "Interligne",
  editorPlaceholder: "Choisissez un fichier pour commencer.",
  previewMarkdown: "Apercu Markdown",
  returnEdit: "Retour a l'edition",
  saved: "Enregistre",
  unsaved: "Non enregistre",
  unloaded: "Aucun fichier",
  diffTitle: "Verifier avant enregistrement",
  cancel: "Annuler",
  close: "Fermer",
  confirmSave: "Confirmer",
  historyDialogTitle: "Historique",
  restoreDraft: "Charger en brouillon",
  checkDialogTitle: "Verification du texte",
  activityDialogTitle: "Activite",
};
I18N["de-DE"] = {
  ...I18N["en-US"],
  loading: "Wird geladen...",
  refreshTitle: "Dateien aktualisieren",
  scope: "Bereich",
  scopeNovel: "Dokumente",
  scopeProject: "Projekt",
  scopeWorld: "Arbeitsbereich",
  openPath: "Pfad offnen",
  open: "Offnen",
  filterFiles: "Dateien filtern",
  filterFilesPlaceholder: "Titel / Pfad",
  contentSearch: "Volltextsuche",
  search: "Suchen",
  notSearched: "Noch nicht gesucht",
  noResults: "Keine Treffer",
  resultsCount: "{count} Treffer",
  searching: "Suche...",
  activityLog: "Aktivitat",
  noFileTitle: "Keine Datei ausgewahlt",
  localeTitle: "Oberflachensprache",
  themeSwitch: "Design",
  reloadFile: "Neu laden",
  history: "Verlauf",
  check: "Prufen",
  viewChanges: "Anderungen",
  save: "Speichern",
  font: "Schrift",
  fontSize: "Grosse",
  lineHeight: "Zeile",
  editorPlaceholder: "Wahlen Sie eine Datei aus.",
  previewMarkdown: "Markdown-Vorschau",
  returnEdit: "Zuruck zum Editor",
  saved: "Gespeichert",
  unsaved: "Ungespeichert",
  unloaded: "Keine Datei",
  diffTitle: "Vor dem Speichern prufen",
  cancel: "Abbrechen",
  close: "Schliessen",
  confirmSave: "Speichern bestatigen",
  historyDialogTitle: "Verlauf",
  restoreDraft: "Als Entwurf laden",
  checkDialogTitle: "Textprufung",
  activityDialogTitle: "Aktivitat",
};
I18N["es-ES"] = {
  ...I18N["en-US"],
  loading: "Cargando...",
  refreshTitle: "Actualizar archivos",
  scope: "Alcance",
  scopeNovel: "Documentos",
  scopeProject: "Proyecto",
  scopeWorld: "Espacio de trabajo",
  openPath: "Abrir ruta",
  open: "Abrir",
  filterFiles: "Filtrar archivos",
  filterFilesPlaceholder: "Titulo / ruta",
  contentSearch: "Busqueda de texto",
  search: "Buscar",
  notSearched: "Sin buscar",
  noResults: "Sin resultados",
  resultsCount: "{count} resultados",
  searching: "Buscando...",
  activityLog: "Actividad",
  noFileTitle: "Ningun archivo seleccionado",
  localeTitle: "Idioma de la interfaz",
  themeSwitch: "Tema",
  reloadFile: "Recargar",
  history: "Historial",
  check: "Revisar",
  viewChanges: "Ver cambios",
  save: "Guardar",
  font: "Fuente",
  fontSize: "Tamano",
  lineHeight: "Linea",
  editorPlaceholder: "Elige un archivo para empezar.",
  previewMarkdown: "Vista Markdown",
  returnEdit: "Volver a editar",
  saved: "Guardado",
  unsaved: "Sin guardar",
  unloaded: "Sin archivo",
  diffTitle: "Revisar antes de guardar",
  cancel: "Cancelar",
  close: "Cerrar",
  confirmSave: "Confirmar guardado",
  historyDialogTitle: "Historial",
  restoreDraft: "Cargar como borrador",
  checkDialogTitle: "Revision de texto",
  activityDialogTitle: "Actividad",
};
I18N["ko-KR"] = {
  ...I18N["en-US"],
  loading: "불러오는 중...",
  refreshTitle: "파일 새로고침",
  scope: "범위",
  scopeNovel: "문서",
  scopeProject: "프로젝트",
  scopeWorld: "작업 공간",
  openPath: "경로 열기",
  open: "열기",
  filterFiles: "파일 필터",
  filterFilesPlaceholder: "제목 / 경로",
  contentSearch: "전체 검색",
  search: "검색",
  notSearched: "검색 전",
  noResults: "결과 없음",
  resultsCount: "{count}개 결과",
  searching: "검색 중...",
  activityLog: "활동",
  noFileTitle: "선택한 파일 없음",
  localeTitle: "인터페이스 언어",
  themeSwitch: "테마",
  reloadFile: "다시 불러오기",
  history: "기록",
  check: "검사",
  viewChanges: "변경 보기",
  save: "저장",
  font: "글꼴",
  fontSize: "크기",
  lineHeight: "줄간격",
  editorPlaceholder: "파일을 선택해 시작하세요.",
  previewMarkdown: "Markdown 미리보기",
  returnEdit: "편집으로 돌아가기",
  saved: "저장됨",
  unsaved: "저장 안 됨",
  unloaded: "파일 없음",
  diffTitle: "저장 전 확인",
  cancel: "취소",
  close: "닫기",
  confirmSave: "저장 확인",
  historyDialogTitle: "기록",
  restoreDraft: "초안으로 불러오기",
  checkDialogTitle: "텍스트 검사",
  activityDialogTitle: "활동",
};
I18N["pt-BR"] = {
  ...I18N["en-US"],
  loading: "Carregando...",
  refreshTitle: "Atualizar arquivos",
  scope: "Escopo",
  scopeNovel: "Documentos",
  scopeProject: "Projeto",
  scopeWorld: "Workspace",
  openPath: "Abrir caminho",
  open: "Abrir",
  filterFiles: "Filtrar arquivos",
  filterFilesPlaceholder: "Titulo / caminho",
  contentSearch: "Busca em texto",
  search: "Buscar",
  notSearched: "Nao pesquisado",
  noResults: "Sem resultados",
  resultsCount: "{count} resultados",
  searching: "Buscando...",
  activityLog: "Atividade",
  noFileTitle: "Nenhum arquivo selecionado",
  localeTitle: "Idioma da interface",
  themeSwitch: "Tema",
  reloadFile: "Recarregar",
  history: "Historico",
  check: "Verificar",
  viewChanges: "Ver alteracoes",
  save: "Salvar",
  font: "Fonte",
  fontSize: "Tamanho",
  lineHeight: "Linha",
  editorPlaceholder: "Escolha um arquivo para comecar.",
  previewMarkdown: "Prever Markdown",
  returnEdit: "Voltar a editar",
  saved: "Salvo",
  unsaved: "Nao salvo",
  unloaded: "Sem arquivo",
  diffTitle: "Revisar antes de salvar",
  cancel: "Cancelar",
  close: "Fechar",
  confirmSave: "Confirmar",
  historyDialogTitle: "Historico",
  restoreDraft: "Carregar como rascunho",
  checkDialogTitle: "Verificacao de texto",
  activityDialogTitle: "Atividade",
};
I18N["it-IT"] = {
  ...I18N["en-US"],
  loading: "Caricamento...",
  refreshTitle: "Aggiorna file",
  scope: "Ambito",
  scopeNovel: "Documenti",
  scopeProject: "Progetto",
  scopeWorld: "Area di lavoro",
  openPath: "Apri percorso",
  open: "Apri",
  filterFiles: "Filtra file",
  filterFilesPlaceholder: "Titolo / percorso",
  contentSearch: "Ricerca nel testo",
  search: "Cerca",
  notSearched: "Non cercato",
  noResults: "Nessun risultato",
  resultsCount: "{count} risultati",
  searching: "Ricerca...",
  activityLog: "Attivita",
  noFileTitle: "Nessun file selezionato",
  localeTitle: "Lingua interfaccia",
  themeSwitch: "Tema",
  reloadFile: "Ricarica",
  history: "Cronologia",
  check: "Controlla",
  viewChanges: "Vedi modifiche",
  save: "Salva",
  font: "Font",
  fontSize: "Dimensione",
  lineHeight: "Interlinea",
  editorPlaceholder: "Scegli un file per iniziare.",
  previewMarkdown: "Anteprima Markdown",
  returnEdit: "Torna a modifica",
  saved: "Salvato",
  unsaved: "Non salvato",
  unloaded: "Nessun file",
  diffTitle: "Rivedi prima di salvare",
  cancel: "Annulla",
  close: "Chiudi",
  confirmSave: "Conferma",
  historyDialogTitle: "Cronologia",
  restoreDraft: "Carica come bozza",
  checkDialogTitle: "Controllo testo",
  activityDialogTitle: "Attivita",
};
I18N["nl-NL"] = {
  ...I18N["en-US"],
  loading: "Laden...",
  refreshTitle: "Bestanden vernieuwen",
  scope: "Bereik",
  scopeNovel: "Documenten",
  scopeProject: "Project",
  scopeWorld: "Werkruimte",
  openPath: "Pad openen",
  open: "Openen",
  filterFiles: "Bestanden filteren",
  filterFilesPlaceholder: "Titel / pad",
  contentSearch: "Volledige tekst zoeken",
  search: "Zoeken",
  notSearched: "Niet gezocht",
  noResults: "Geen resultaten",
  resultsCount: "{count} resultaten",
  searching: "Zoeken...",
  activityLog: "Activiteit",
  noFileTitle: "Geen bestand geselecteerd",
  localeTitle: "Interfacetaal",
  themeSwitch: "Thema",
  reloadFile: "Herladen",
  history: "Geschiedenis",
  check: "Controleren",
  viewChanges: "Wijzigingen",
  save: "Opslaan",
  font: "Lettertype",
  fontSize: "Grootte",
  lineHeight: "Regel",
  editorPlaceholder: "Kies een bestand om te beginnen.",
  previewMarkdown: "Markdown voorbeeld",
  returnEdit: "Terug naar bewerken",
  saved: "Opgeslagen",
  unsaved: "Niet opgeslagen",
  unloaded: "Geen bestand",
  diffTitle: "Controleren voor opslaan",
  cancel: "Annuleren",
  close: "Sluiten",
  confirmSave: "Bevestigen",
  historyDialogTitle: "Geschiedenis",
  restoreDraft: "Als concept laden",
  checkDialogTitle: "Tekstcontrole",
  activityDialogTitle: "Activiteit",
};
I18N["pl-PL"] = {
  ...I18N["en-US"],
  loading: "Ladowanie...",
  refreshTitle: "Odswiez pliki",
  scope: "Zakres",
  scopeNovel: "Dokumenty",
  scopeProject: "Projekt",
  scopeWorld: "Obszar roboczy",
  openPath: "Otworz sciezke",
  open: "Otworz",
  filterFiles: "Filtruj pliki",
  filterFilesPlaceholder: "Tytul / sciezka",
  contentSearch: "Wyszukiwanie tekstu",
  search: "Szukaj",
  notSearched: "Nie szukano",
  noResults: "Brak wynikow",
  resultsCount: "{count} wynikow",
  searching: "Szukam...",
  activityLog: "Aktywnosc",
  noFileTitle: "Nie wybrano pliku",
  localeTitle: "Jezyk interfejsu",
  themeSwitch: "Motyw",
  reloadFile: "Przeladuj",
  history: "Historia",
  check: "Sprawdz",
  viewChanges: "Zmiany",
  save: "Zapisz",
  font: "Czcionka",
  fontSize: "Rozmiar",
  lineHeight: "Linia",
  editorPlaceholder: "Wybierz plik, aby zaczac.",
  previewMarkdown: "Podglad Markdown",
  returnEdit: "Wroc do edycji",
  saved: "Zapisano",
  unsaved: "Niezapisane",
  unloaded: "Brak pliku",
  diffTitle: "Sprawdz przed zapisem",
  cancel: "Anuluj",
  close: "Zamknij",
  confirmSave: "Potwierdz",
  historyDialogTitle: "Historia",
  restoreDraft: "Wczytaj jako szkic",
  checkDialogTitle: "Kontrola tekstu",
  activityDialogTitle: "Aktywnosc",
};
I18N["ru-RU"] = {
  ...I18N["en-US"],
  loading: "Загрузка...",
  refreshTitle: "Обновить файлы",
  scope: "Область",
  scopeNovel: "Документы",
  scopeProject: "Проект",
  scopeWorld: "Рабочая папка",
  openPath: "Открыть путь",
  open: "Открыть",
  filterFiles: "Фильтр файлов",
  filterFilesPlaceholder: "Название / путь",
  contentSearch: "Поиск по тексту",
  search: "Поиск",
  notSearched: "Поиск не выполнен",
  noResults: "Нет результатов",
  resultsCount: "{count} результатов",
  searching: "Поиск...",
  activityLog: "Действия",
  noFileTitle: "Файл не выбран",
  localeTitle: "Язык интерфейса",
  themeSwitch: "Тема",
  reloadFile: "Перезагрузить",
  history: "История",
  check: "Проверка",
  viewChanges: "Изменения",
  save: "Сохранить",
  font: "Шрифт",
  fontSize: "Размер",
  lineHeight: "Строка",
  editorPlaceholder: "Выберите файл, чтобы начать.",
  previewMarkdown: "Предпросмотр Markdown",
  returnEdit: "Назад к правке",
  saved: "Сохранено",
  unsaved: "Не сохранено",
  unloaded: "Нет файла",
  diffTitle: "Проверить перед сохранением",
  cancel: "Отмена",
  close: "Закрыть",
  confirmSave: "Подтвердить",
  historyDialogTitle: "История",
  restoreDraft: "Загрузить как черновик",
  checkDialogTitle: "Проверка текста",
  activityDialogTitle: "Действия",
};
I18N["tr-TR"] = {
  ...I18N["en-US"],
  loading: "Yukleniyor...",
  refreshTitle: "Dosyalari yenile",
  scope: "Kapsam",
  scopeNovel: "Belgeler",
  scopeProject: "Proje",
  scopeWorld: "Calisma alani",
  openPath: "Yol ac",
  open: "Ac",
  filterFiles: "Dosyalari filtrele",
  filterFilesPlaceholder: "Baslik / yol",
  contentSearch: "Tam metin arama",
  search: "Ara",
  notSearched: "Aranmadi",
  noResults: "Sonuc yok",
  resultsCount: "{count} sonuc",
  searching: "Araniyor...",
  activityLog: "Etkinlik",
  noFileTitle: "Dosya secilmedi",
  localeTitle: "Arayuz dili",
  themeSwitch: "Tema",
  reloadFile: "Yeniden yukle",
  history: "Gecmis",
  check: "Denetle",
  viewChanges: "Degisiklikler",
  save: "Kaydet",
  font: "Yazi tipi",
  fontSize: "Boyut",
  lineHeight: "Satir",
  editorPlaceholder: "Baslamak icin bir dosya secin.",
  previewMarkdown: "Markdown onizleme",
  returnEdit: "Duzenlemeye don",
  saved: "Kaydedildi",
  unsaved: "Kaydedilmedi",
  unloaded: "Dosya yok",
  diffTitle: "Kaydetmeden once incele",
  cancel: "Iptal",
  close: "Kapat",
  confirmSave: "Onayla",
  historyDialogTitle: "Gecmis",
  restoreDraft: "Taslak olarak yukle",
  checkDialogTitle: "Metin denetimi",
  activityDialogTitle: "Etkinlik",
};
I18N["ar-SA"] = {
  ...I18N["en-US"],
  loading: "جار التحميل...",
  refreshTitle: "تحديث الملفات",
  scope: "النطاق",
  scopeNovel: "المستندات",
  scopeProject: "المشروع",
  scopeWorld: "مساحة العمل",
  openPath: "فتح المسار",
  open: "فتح",
  filterFiles: "تصفية الملفات",
  filterFilesPlaceholder: "العنوان / المسار",
  contentSearch: "بحث نصي كامل",
  search: "بحث",
  notSearched: "لم يتم البحث",
  noResults: "لا توجد نتائج",
  resultsCount: "{count} نتائج",
  searching: "جار البحث...",
  activityLog: "النشاط",
  noFileTitle: "لم يتم اختيار ملف",
  localeTitle: "لغة الواجهة",
  themeSwitch: "السمة",
  reloadFile: "إعادة تحميل",
  history: "السجل",
  check: "فحص",
  viewChanges: "عرض التغييرات",
  save: "حفظ",
  font: "الخط",
  fontSize: "الحجم",
  lineHeight: "السطر",
  editorPlaceholder: "اختر ملفا للبدء.",
  previewMarkdown: "معاينة Markdown",
  returnEdit: "العودة للتحرير",
  saved: "تم الحفظ",
  unsaved: "غير محفوظ",
  unloaded: "لا يوجد ملف",
  diffTitle: "المراجعة قبل الحفظ",
  cancel: "إلغاء",
  close: "إغلاق",
  confirmSave: "تأكيد",
  historyDialogTitle: "السجل",
  restoreDraft: "تحميل كمسودة",
  checkDialogTitle: "فحص النص",
  activityDialogTitle: "النشاط",
};
I18N["hi-IN"] = {
  ...I18N["en-US"],
  loading: "लोड हो रहा है...",
  refreshTitle: "फाइलें रीफ्रेश करें",
  scope: "दायरा",
  scopeNovel: "दस्तावेज",
  scopeProject: "प्रोजेक्ट",
  scopeWorld: "वर्कस्पेस",
  openPath: "पाथ खोलें",
  open: "खोलें",
  filterFiles: "फाइल छांटें",
  filterFilesPlaceholder: "शीर्षक / पाथ",
  contentSearch: "पूर्ण पाठ खोज",
  search: "खोजें",
  notSearched: "खोजा नहीं गया",
  noResults: "कोई परिणाम नहीं",
  resultsCount: "{count} परिणाम",
  searching: "खोज रहा है...",
  activityLog: "गतिविधि",
  noFileTitle: "कोई फाइल चयनित नहीं",
  localeTitle: "इंटरफेस भाषा",
  themeSwitch: "थीम",
  reloadFile: "रीलोड",
  history: "इतिहास",
  check: "जांच",
  viewChanges: "बदलाव देखें",
  save: "सेव",
  font: "फॉन्ट",
  fontSize: "आकार",
  lineHeight: "लाइन",
  editorPlaceholder: "शुरू करने के लिए फाइल चुनें.",
  previewMarkdown: "Markdown पूर्वावलोकन",
  returnEdit: "संपादन पर लौटें",
  saved: "सेव हुआ",
  unsaved: "सेव नहीं हुआ",
  unloaded: "कोई फाइल नहीं",
  diffTitle: "सेव से पहले समीक्षा",
  cancel: "रद्द",
  close: "बंद",
  confirmSave: "पुष्टि",
  historyDialogTitle: "इतिहास",
  restoreDraft: "ड्राफ्ट के रूप में लोड",
  checkDialogTitle: "टेक्स्ट जांच",
  activityDialogTitle: "गतिविधि",
};
I18N["id-ID"] = {
  ...I18N["en-US"],
  loading: "Memuat...",
  refreshTitle: "Segarkan file",
  scope: "Cakupan",
  scopeNovel: "Dokumen",
  scopeProject: "Proyek",
  scopeWorld: "Ruang kerja",
  openPath: "Buka jalur",
  open: "Buka",
  filterFiles: "Filter file",
  filterFilesPlaceholder: "Judul / jalur",
  contentSearch: "Pencarian teks",
  search: "Cari",
  notSearched: "Belum dicari",
  noResults: "Tidak ada hasil",
  resultsCount: "{count} hasil",
  searching: "Mencari...",
  activityLog: "Aktivitas",
  noFileTitle: "Belum ada file",
  localeTitle: "Bahasa antarmuka",
  themeSwitch: "Tema",
  reloadFile: "Muat ulang",
  history: "Riwayat",
  check: "Periksa",
  viewChanges: "Lihat perubahan",
  save: "Simpan",
  font: "Font",
  fontSize: "Ukuran",
  lineHeight: "Baris",
  editorPlaceholder: "Pilih file untuk mulai.",
  previewMarkdown: "Pratinjau Markdown",
  returnEdit: "Kembali mengedit",
  saved: "Tersimpan",
  unsaved: "Belum disimpan",
  unloaded: "Tidak ada file",
  diffTitle: "Tinjau sebelum simpan",
  cancel: "Batal",
  close: "Tutup",
  confirmSave: "Konfirmasi",
  historyDialogTitle: "Riwayat",
  restoreDraft: "Muat sebagai draf",
  checkDialogTitle: "Pemeriksaan teks",
  activityDialogTitle: "Aktivitas",
};
I18N["vi-VN"] = {
  ...I18N["en-US"],
  loading: "Dang tai...",
  refreshTitle: "Lam moi tep",
  scope: "Pham vi",
  scopeNovel: "Tai lieu",
  scopeProject: "Du an",
  scopeWorld: "Khong gian lam viec",
  openPath: "Mo duong dan",
  open: "Mo",
  filterFiles: "Loc tep",
  filterFilesPlaceholder: "Tieu de / duong dan",
  contentSearch: "Tim kiem van ban",
  search: "Tim",
  notSearched: "Chua tim",
  noResults: "Khong co ket qua",
  resultsCount: "{count} ket qua",
  searching: "Dang tim...",
  activityLog: "Hoat dong",
  noFileTitle: "Chua chon tep",
  localeTitle: "Ngon ngu giao dien",
  themeSwitch: "Chu de",
  reloadFile: "Tai lai",
  history: "Lich su",
  check: "Kiem tra",
  viewChanges: "Xem thay doi",
  save: "Luu",
  font: "Phong chu",
  fontSize: "Co chu",
  lineHeight: "Dong",
  editorPlaceholder: "Chon tep de bat dau.",
  previewMarkdown: "Xem truoc Markdown",
  returnEdit: "Quay lai sua",
  saved: "Da luu",
  unsaved: "Chua luu",
  unloaded: "Khong co tep",
  diffTitle: "Xem lai truoc khi luu",
  cancel: "Huy",
  close: "Dong",
  confirmSave: "Xac nhan",
  historyDialogTitle: "Lich su",
  restoreDraft: "Tai thanh ban nhap",
  checkDialogTitle: "Kiem tra van ban",
  activityDialogTitle: "Hoat dong",
};
I18N["th-TH"] = {
  ...I18N["en-US"],
  loading: "กำลังโหลด...",
  refreshTitle: "รีเฟรชไฟล์",
  scope: "ขอบเขต",
  scopeNovel: "เอกสาร",
  scopeProject: "โปรเจกต์",
  scopeWorld: "พื้นที่ทำงาน",
  openPath: "เปิดเส้นทาง",
  open: "เปิด",
  filterFiles: "กรองไฟล์",
  filterFilesPlaceholder: "ชื่อ / เส้นทาง",
  contentSearch: "ค้นหาข้อความ",
  search: "ค้นหา",
  notSearched: "ยังไม่ได้ค้นหา",
  noResults: "ไม่พบผลลัพธ์",
  resultsCount: "{count} ผลลัพธ์",
  searching: "กำลังค้นหา...",
  activityLog: "กิจกรรม",
  noFileTitle: "ยังไม่ได้เลือกไฟล์",
  localeTitle: "ภาษาอินเทอร์เฟซ",
  themeSwitch: "ธีม",
  reloadFile: "โหลดใหม่",
  history: "ประวัติ",
  check: "ตรวจสอบ",
  viewChanges: "ดูการเปลี่ยนแปลง",
  save: "บันทึก",
  font: "ฟอนต์",
  fontSize: "ขนาด",
  lineHeight: "บรรทัด",
  editorPlaceholder: "เลือกไฟล์เพื่อเริ่มต้น",
  previewMarkdown: "ดูตัวอย่าง Markdown",
  returnEdit: "กลับไปแก้ไข",
  saved: "บันทึกแล้ว",
  unsaved: "ยังไม่บันทึก",
  unloaded: "ไม่มีไฟล์",
  diffTitle: "ตรวจทานก่อนบันทึก",
  cancel: "ยกเลิก",
  close: "ปิด",
  confirmSave: "ยืนยัน",
  historyDialogTitle: "ประวัติ",
  restoreDraft: "โหลดเป็นฉบับร่าง",
  checkDialogTitle: "ตรวจข้อความ",
  activityDialogTitle: "กิจกรรม",
};

function t(key, vars = {}) {
  const template = (I18N[state.locale] && I18N[state.locale][key]) || I18N["en-US"][key] || key;
  return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), template);
}

const els = {
  rootLabel: document.querySelector("#rootLabel"),
  fileList: document.querySelector("#fileList"),
  scopeSelect: document.querySelector("#scopeSelect"),
  openPathInput: document.querySelector("#openPathInput"),
  openPathButton: document.querySelector("#openPathButton"),
  fileSearch: document.querySelector("#fileSearch"),
  contentSearch: document.querySelector("#contentSearch"),
  contentSearchButton: document.querySelector("#contentSearchButton"),
  searchSummary: document.querySelector("#searchSummary"),
  searchResults: document.querySelector("#searchResults"),
  refreshFiles: document.querySelector("#refreshFiles"),
  fileTitle: document.querySelector("#fileTitle"),
  renameFile: document.querySelector("#renameFile"),
  filePath: document.querySelector("#filePath"),
  saveState: document.querySelector("#saveState"),
  charCount: document.querySelector("#charCount"),
  cursorState: document.querySelector("#cursorState"),
  mtimeState: document.querySelector("#mtimeState"),
  appVersion: document.querySelector("#appVersion"),
  updateNotice: document.querySelector("#updateNotice"),
  backupState: document.querySelector("#backupState"),
  themeButtons: document.querySelectorAll("[data-theme]"),
  accentButtons: document.querySelectorAll("[data-accent]"),
  editorFontFamily: document.querySelector("#editorFontFamily"),
  editorFontSize: document.querySelector("#editorFontSize"),
  editorLineHeight: document.querySelector("#editorLineHeight"),
  localeSelect: document.querySelector("#localeSelect"),
  formatButtons: document.querySelectorAll("[data-format]"),
  lineNumbers: document.querySelector("#lineNumbers"),
  lineMeasure: document.querySelector("#lineMeasure"),
  caretLineMarker: document.querySelector("#caretLineMarker"),
  editor: document.querySelector("#editor"),
  searchHitMarker: document.querySelector("#searchHitMarker"),
  preview: document.querySelector("#preview"),
  reloadFile: document.querySelector("#reloadFile"),
  previewDiff: document.querySelector("#previewDiff"),
  historyFile: document.querySelector("#historyFile"),
  checkFile: document.querySelector("#checkFile"),
  saveFile: document.querySelector("#saveFile"),
  togglePreview: document.querySelector("#togglePreview"),
  diffDialog: document.querySelector("#diffDialog"),
  diffView: document.querySelector("#diffView"),
  diffSummary: document.querySelector("#diffSummary"),
  confirmSave: document.querySelector("#confirmSave"),
  historyDialog: document.querySelector("#historyDialog"),
  historySummary: document.querySelector("#historySummary"),
  historyList: document.querySelector("#historyList"),
  historyDiff: document.querySelector("#historyDiff"),
  restoreHistory: document.querySelector("#restoreHistory"),
  createFolder: document.querySelector("#createFolder"),
  checkDialog: document.querySelector("#checkDialog"),
  checkSummary: document.querySelector("#checkSummary"),
  checkResults: document.querySelector("#checkResults"),
  localePolicyDialog: document.querySelector("#localePolicyDialog"),
  localePolicyTitle: document.querySelector("#localePolicyTitle"),
  localePolicySubtitle: document.querySelector("#localePolicySubtitle"),
  localePolicyIntro: document.querySelector("#localePolicyIntro"),
  localePolicyPhrase: document.querySelector("#localePolicyPhrase"),
  localePolicyInput: document.querySelector("#localePolicyInput"),
  localePolicyCopy: document.querySelector("#localePolicyCopy"),
  localePolicyError: document.querySelector("#localePolicyError"),
  localePolicyCancel: document.querySelector("#localePolicyCancel"),
  localePolicyConfirm: document.querySelector("#localePolicyConfirm"),
  textPromptDialog: document.querySelector("#textPromptDialog"),
  textPromptTitle: document.querySelector("#textPromptTitle"),
  textPromptSubtitle: document.querySelector("#textPromptSubtitle"),
  textPromptInput: document.querySelector("#textPromptInput"),
  textPromptError: document.querySelector("#textPromptError"),
  textPromptCancel: document.querySelector("#textPromptCancel"),
  textPromptConfirm: document.querySelector("#textPromptConfirm"),
  showActivity: document.querySelector("#showActivity"),
  activityDialog: document.querySelector("#activityDialog"),
  activityView: document.querySelector("#activityView"),
};

function api(path, options = {}) {
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.error || "请求失败");
      error.payload = data;
      error.status = response.status;
      throw error;
    }
    return data;
  });
}

function loadTheme() {
  const savedTheme = window.localStorage.getItem(THEME_KEY);
  if (["light", "dark", "eye"].includes(savedTheme)) {
    state.theme = savedTheme;
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  els.themeButtons.forEach((button) => {
    const active = button.dataset.theme === state.theme;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  updateSearchMarker();
}

function setTheme(theme) {
  if (!["light", "dark", "eye"].includes(theme)) return;
  state.theme = theme;
  window.localStorage.setItem(THEME_KEY, theme);
  applyTheme();
}

function loadAccent() {
  const savedAccent = window.localStorage.getItem(ACCENT_KEY);
  if (ACCENTS[savedAccent]) {
    state.accent = savedAccent;
  }
}

function applyAccent() {
  const accent = ACCENTS[state.accent] || ACCENTS.crimson;
  document.documentElement.style.setProperty("--focus-color", accent.color);
  document.documentElement.style.setProperty("--focus-soft", accent.soft);
  document.documentElement.style.setProperty("--focus-selection", accent.selection);
  els.accentButtons.forEach((button) => {
    const active = button.dataset.accent === state.accent;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setAccent(accent) {
  if (!ACCENTS[accent]) return;
  state.accent = accent;
  window.localStorage.setItem(ACCENT_KEY, accent);
  applyAccent();
}

function loadViewPrefs() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(VIEW_PREF_KEY) || "{}");
    state.viewPrefs = {
      ...state.viewPrefs,
      ...saved,
      fontSize: clampFontSize(Number(saved.fontSize) || state.viewPrefs.fontSize),
      lineHeight: Number(saved.lineHeight) || state.viewPrefs.lineHeight,
    };
  } catch (_) {
    window.localStorage.removeItem(VIEW_PREF_KEY);
  }
}

function saveViewPrefs() {
  window.localStorage.setItem(VIEW_PREF_KEY, JSON.stringify(state.viewPrefs));
}

function clampFontSize(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) return state.viewPrefs.fontSize;
  return Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, Math.round(next)));
}

function setEditorFontSize(value) {
  state.viewPrefs.fontSize = clampFontSize(value);
  saveViewPrefs();
  applyViewPrefs();
}

function applyViewPrefs() {
  const { fontFamily, fontSize, lineHeight } = state.viewPrefs;
  els.editor.style.fontFamily = fontFamily;
  els.preview.style.fontFamily = fontFamily;
  els.editor.style.fontSize = `${fontSize}px`;
  els.preview.style.fontSize = `${fontSize}px`;
  els.editor.style.lineHeight = lineHeight;
  els.preview.style.lineHeight = lineHeight;
  if (els.lineNumbers) {
    const baseLineHeight = fontSize * lineHeight;
    els.lineNumbers.style.setProperty("--base-line-height", `${baseLineHeight}px`);
    els.lineNumbers.style.setProperty("--line-number-height", `${baseLineHeight}px`);
  }
  els.editorFontFamily.value = fontFamily;
  els.editorFontSize.value = String(fontSize);
  els.editorLineHeight.value = String(lineHeight);
  updateStats();
  updateSearchMarker();
}

function setText(selector, key) {
  const element = document.querySelector(selector);
  if (element) element.textContent = t(key);
}

function setTitle(selector, key) {
  const element = document.querySelector(selector);
  if (element) element.title = t(key);
}

function setPlaceholder(selector, key) {
  const element = document.querySelector(selector);
  if (element) element.placeholder = t(key);
}

function localePolicyKey(locale) {
  return `${LOCALE_POLICY_KEY_PREFIX}.${locale}`;
}

function isLocalePolicyAcknowledged(locale) {
  return window.localStorage.getItem(localePolicyKey(locale)) === "true";
}

function normalizePolicyText(text) {
  return String(text || "").trim().replace(/\s+/g, "");
}

function requiredPolicyPhrase(locale) {
  return LOCALE_POLICY_PHRASES[locale] || LOCALE_POLICY_PHRASES["zh-CN"];
}

function canEnableLocale(locale) {
  return !RESTRICTED_LOCALES.has(locale) || isLocalePolicyAcknowledged(locale);
}

function loadLocalePreference() {
  const savedLocale = window.localStorage.getItem(LOCALE_KEY);
  if (savedLocale && I18N[savedLocale]) {
    if (RESTRICTED_LOCALES.has(savedLocale) && savedLocale !== "zh-CN" && !isLocalePolicyAcknowledged(savedLocale)) {
      window.localStorage.setItem(LOCALE_KEY, "zh-CN");
      state.locale = "zh-CN";
      return;
    }
    state.locale = savedLocale;
  }
}

function applyLocaleStaticText() {
  document.documentElement.lang = state.locale;
  document.title = t("appTitle");
  els.localeSelect.value = state.locale;
  els.localeSelect.title = t("localeTitle");
  els.localeSelect.setAttribute("aria-label", t("localeTitle"));
  setText(".brand h1", "appTitle");
  setTitle("#refreshFiles", "refreshTitle");
  const searchBoxLabels = [...document.querySelectorAll(".searchBox > span")];
  if (searchBoxLabels[0]) searchBoxLabels[0].textContent = t("scope");
  document.querySelector('#scopeSelect option[value="novel"]').textContent = t("scopeNovel");
  document.querySelector('#scopeSelect option[value="project"]').textContent = t("scopeProject");
  document.querySelector('#scopeSelect option[value="world"]').textContent = t("scopeWorld");
  if (searchBoxLabels[1]) searchBoxLabels[1].textContent = t("openPath");
  setPlaceholder("#openPathInput", "openPathPlaceholder");
  setText("#openPathButton", "open");
  if (searchBoxLabels[2]) searchBoxLabels[2].textContent = t("filterFiles");
  setPlaceholder("#fileSearch", "filterFilesPlaceholder");
  if (searchBoxLabels[3]) searchBoxLabels[3].textContent = t("contentSearch");
  setPlaceholder("#contentSearch", "contentSearchPlaceholder");
  setText("#contentSearchButton", "search");
  if (els.searchSummary.textContent === I18N["zh-CN"].notSearched || els.searchSummary.textContent === I18N["en-US"].notSearched || els.searchSummary.textContent === I18N["zh-Hant"].notSearched || els.searchSummary.textContent === I18N["ja-JP"].notSearched) {
    els.searchSummary.textContent = t("notSearched");
  }
  setText("#showActivity", "activityLog");
  setText("#createFolder", "createFolder");
  setTitle("#createFolder", "createFolderTitle");
  setText("#renameFile", "renameFile");
  setTitle("#renameFile", "renameFileTitle");
  if (els.appVersion) els.appVersion.textContent = APP_VERSION;
  if (els.updateNotice && !els.updateNotice.classList.contains("hidden")) {
    els.updateNotice.title = t("updateOpen");
  }
  if (!state.currentPath) {
    els.fileTitle.textContent = t("noFileTitle");
    els.filePath.textContent = t("noFilePath");
  }
  document.querySelector(".themeSwitch").setAttribute("aria-label", t("themeSwitch"));
  const themeLabels = { light: "lightTheme", dark: "darkTheme", eye: "eyeTheme" };
  els.themeButtons.forEach((button) => {
    const label = t(themeLabels[button.dataset.theme] || "themeSwitch");
    button.title = label;
    button.setAttribute("aria-label", label);
  });
  setText("#reloadFile", "reloadFile");
  setTitle("#reloadFile", "reloadTitle");
  setText("#historyFile", "history");
  setTitle("#historyFile", "historyTitle");
  setText("#checkFile", "check");
  setTitle("#checkFile", "checkTitle");
  setText("#previewDiff", "viewChanges");
  setTitle("#previewDiff", "viewChangesTitle");
  setText("#saveFile", "save");
  setText(".fontFamilyControl span", "font");
  setText(".fontSizeControl span", "fontSize");
  setText(".lineHeightControl span", "lineHeight");
  document.querySelector(".formatBar").setAttribute("aria-label", t("formatLabel"));
  setTitle('[data-format="bold"]', "boldTitle");
  setTitle('[data-format="italic"]', "italicTitle");
  setTitle('[data-format="h1"]', "h1Title");
  setTitle('[data-format="h2"]', "h2Title");
  setTitle('[data-format="quote"]', "quoteTitle");
  setTitle('[data-format="list"]', "listTitle");
  setTitle('[data-format="ordered-list"]', "orderedListTitle");
  setTitle('[data-format="inline-code"]', "inlineCodeTitle");
  setTitle('[data-format="strike"]', "strikeTitle");
  setTitle('[data-format="link"]', "linkTitle");
  setTitle('[data-format="hr"]', "hrTitle");
  setPlaceholder("#editor", "editorPlaceholder");
  els.togglePreview.textContent = state.showingPreview ? t("returnEdit") : t("previewMarkdown");
  els.diffDialog.querySelector("strong").textContent = t("diffTitle");
  if (!els.diffSummary.textContent || els.diffSummary.textContent === I18N["zh-CN"].diffSummaryDefault || els.diffSummary.textContent === I18N["en-US"].diffSummaryDefault) {
    els.diffSummary.textContent = t("diffSummaryDefault");
  }
  els.confirmSave.textContent = t("confirmSave");
  [...els.diffDialog.querySelectorAll('button[value="cancel"]')].forEach((button) => {
    button.textContent = button.classList.contains("iconButton") ? "×" : t("cancel");
    button.title = button.classList.contains("iconButton") ? t("close") : "";
  });
  els.historyDialog.querySelector("strong").textContent = t("historyDialogTitle");
  els.restoreHistory.textContent = t("restoreDraft");
  [...els.historyDialog.querySelectorAll('button[value="cancel"]')].forEach((button) => {
    button.textContent = button.classList.contains("iconButton") ? "×" : t("close");
    button.title = button.classList.contains("iconButton") ? t("close") : "";
  });
  els.checkDialog.querySelector("strong").textContent = t("checkDialogTitle");
  [...els.checkDialog.querySelectorAll('button[value="cancel"]')].forEach((button) => {
    button.textContent = button.classList.contains("iconButton") ? "×" : t("close");
    button.title = button.classList.contains("iconButton") ? t("close") : "";
  });
  els.activityDialog.querySelector("strong").textContent = t("activityDialogTitle");
  els.activityDialog.querySelector("header span").textContent = t("activityDialogSubtitle");
  [...els.activityDialog.querySelectorAll('button[value="cancel"]')].forEach((button) => {
    button.textContent = button.classList.contains("iconButton") ? "×" : t("close");
    button.title = button.classList.contains("iconButton") ? t("close") : "";
  });
  els.localePolicyTitle.textContent = t("localePolicyTitle");
  els.localePolicySubtitle.textContent = t("localePolicySubtitle");
  els.localePolicyIntro.textContent = t("localePolicyIntro");
  els.localePolicyInput.placeholder = t("localePolicyPlaceholder");
  els.localePolicyCopy.textContent = t("localePolicyCopy");
  els.localePolicyCancel.textContent = t("localePolicyCancel");
  els.localePolicyConfirm.textContent = t("localePolicyConfirm");
  els.textPromptCancel.textContent = t("cancel");
  els.textPromptConfirm.textContent = t("promptConfirm");
  updateStats();
  markDirty(state.dirty);
}

function applyLocale(locale) {
  state.locale = locale;
  window.localStorage.setItem(LOCALE_KEY, locale);
  applyLocaleStaticText();
}

function openLocalePolicy(locale) {
  state.pendingLocale = locale;
  const phrase = requiredPolicyPhrase(locale);
  els.localePolicyPhrase.textContent = phrase;
  els.localePolicyInput.value = "";
  els.localePolicyError.textContent = "";
  els.localeSelect.value = state.locale;
  els.localePolicyDialog.showModal();
  els.localePolicyInput.focus();
}

function requestLocale(locale) {
  if (!I18N[locale]) return;
  if (locale === state.locale) return;
  if (!canEnableLocale(locale)) {
    openLocalePolicy(locale);
    return;
  }
  applyLocale(locale);
}

function confirmLocalePolicy() {
  const locale = state.pendingLocale;
  const expected = normalizePolicyText(requiredPolicyPhrase(locale));
  const actual = normalizePolicyText(els.localePolicyInput.value);
  if (!locale || actual !== expected) {
    els.localePolicyError.textContent = t("localePolicyError");
    return;
  }
  window.localStorage.setItem(localePolicyKey(locale), "true");
  els.localePolicyDialog.close();
  state.pendingLocale = "";
  applyLocale(locale);
}

function openTextPrompt({ title, subtitle = "", value = "", required = true }) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      els.textPromptDialog.removeEventListener("close", handleClose);
      els.textPromptConfirm.removeEventListener("click", handleConfirm);
      resolve(result);
    };
    const handleClose = () => finish(null);
    const handleConfirm = () => {
      const nextValue = els.textPromptInput.value.trim();
      if (required && !nextValue) {
        els.textPromptError.textContent = t("promptRequired");
        els.textPromptInput.focus();
        return;
      }
      finish(nextValue);
      els.textPromptDialog.close("confirm");
    };

    els.textPromptTitle.textContent = title || t("promptTitle");
    els.textPromptSubtitle.textContent = subtitle;
    els.textPromptInput.value = value;
    els.textPromptError.textContent = "";
    els.textPromptDialog.addEventListener("close", handleClose);
    els.textPromptConfirm.addEventListener("click", handleConfirm);
    els.textPromptDialog.showModal();
    window.setTimeout(() => {
      els.textPromptInput.focus();
      els.textPromptInput.select();
    }, 0);
  });
}

function hashText(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

function markDirty(dirty) {
  state.dirty = dirty;
  els.saveState.className = dirty ? "dirty" : "saved";
  els.saveState.textContent = dirty ? t("unsaved") : state.currentPath ? t("saved") : t("unloaded");
  els.renameFile.disabled = !state.currentPath;
}

function syncLineNumberScroll() {
  if (!els.lineNumbers) return;
  els.lineNumbers.scrollTop = els.editor.scrollTop;
}

function updateCaretLineMarker() {
  const marker = els.caretLineMarker;
  if (!marker || !state.currentPath || state.showingPreview) {
    marker?.classList.add("hidden");
    return;
  }
  const active = els.lineNumbers?.querySelector(`[data-line="${state.activeLine}"]`);
  if (!active) {
    marker.classList.add("hidden");
    return;
  }
  const editor = els.editor;
  const shell = editor.parentElement;
  const shellRect = shell.getBoundingClientRect();
  const editorRect = editor.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const top = activeRect.top - shellRect.top;
  const minTop = editorRect.top - shellRect.top;
  const maxTop = editorRect.bottom - shellRect.top;
  if (top + activeRect.height < minTop || top > maxTop) {
    marker.classList.add("hidden");
    return;
  }
  const visibleTop = Math.max(minTop, top);
  marker.style.top = `${visibleTop}px`;
  marker.style.left = `${editorRect.left - shellRect.left}px`;
  marker.style.width = `${editorRect.width}px`;
  marker.style.height = `${Math.min(activeRect.height, maxTop - visibleTop)}px`;
  marker.classList.remove("hidden");
}

function measureVisualLineHeights(lines) {
  if (!els.lineMeasure) return [];
  const editorStyles = window.getComputedStyle(els.editor);
  const fontSize = parseFloat(editorStyles.fontSize) || state.viewPrefs.fontSize;
  const lineHeight = parseFloat(editorStyles.lineHeight) || fontSize * state.viewPrefs.lineHeight;
  const paddingLeft = parseFloat(editorStyles.paddingLeft) || 0;
  const paddingRight = parseFloat(editorStyles.paddingRight) || 0;
  const contentWidth = Math.max(40, els.editor.clientWidth - paddingLeft - paddingRight);

  els.lineMeasure.style.width = `${contentWidth}px`;
  els.lineMeasure.style.fontFamily = editorStyles.fontFamily;
  els.lineMeasure.style.fontSize = editorStyles.fontSize;
  els.lineMeasure.style.fontWeight = editorStyles.fontWeight;
  els.lineMeasure.style.letterSpacing = editorStyles.letterSpacing;
  els.lineMeasure.style.lineHeight = editorStyles.lineHeight;

  return lines.map((rawLine) => {
    els.lineMeasure.textContent = rawLine || " ";
    const rows = Math.max(1, Math.round(els.lineMeasure.scrollHeight / lineHeight));
    return {
      rows,
      height: rows * lineHeight,
    };
  });
}

function updateLineNumbers(line, lines) {
  if (!els.lineNumbers) return;
  const sourceLines = lines.length ? lines : [""];
  const nextCount = sourceLines.length;
  const metricsKey = [
    nextCount,
    els.editor.clientWidth,
    state.viewPrefs.fontFamily,
    state.viewPrefs.fontSize,
    state.viewPrefs.lineHeight,
    hashText(sourceLines.join("\n")),
  ].join("|");

  if (state.lineCount !== nextCount || state.lineMetricsKey !== metricsKey) {
    const metrics = measureVisualLineHeights(sourceLines);
    const fragment = document.createDocumentFragment();
    for (let index = 1; index <= nextCount; index += 1) {
      const item = document.createElement("span");
      const metric = metrics[index - 1] || { rows: 1, height: state.viewPrefs.fontSize * state.viewPrefs.lineHeight };
      item.dataset.line = String(index);
      item.textContent = String(index);
      item.style.height = `${metric.height}px`;
      item.classList.toggle("wrapped", metric.rows > 1);
      fragment.appendChild(item);
    }
    els.lineNumbers.replaceChildren(fragment);
    state.lineCount = nextCount;
    state.lineMetricsKey = metricsKey;
  }

  if (state.activeLine !== line) {
    els.lineNumbers.querySelector(".active")?.classList.remove("active");
    state.activeLine = line;
  }
  const active = els.lineNumbers.querySelector(`[data-line="${line}"]`);
  if (active) active.classList.add("active");
  syncLineNumberScroll();
  updateCaretLineMarker();
}

function updateStats() {
  const text = els.editor.value;
  const visibleChars = text.replace(/\s/g, "").length;
  els.charCount.textContent = t("chars", { count: visibleChars });

  const pos = els.editor.selectionStart || 0;
  const before = text.slice(0, pos);
  const line = before.split("\n").length;
  const col = before.length - before.lastIndexOf("\n");
  els.cursorState.textContent = t("cursor", { line, col });
  updateLineNumbers(line, text.split("\n"));
}

function clearSearchMarker() {
  state.searchHit = null;
  els.searchHitMarker.classList.add("hidden");
}

function updateSearchMarker() {
  const marker = els.searchHitMarker;
  if (!state.searchHit || !state.currentPath || state.showingPreview) {
    marker.classList.add("hidden");
    return;
  }

  const editor = els.editor;
  const styles = window.getComputedStyle(editor);
  const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.85 || 31;
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const paddingLeft = parseFloat(styles.paddingLeft) || 0;
  const paddingRight = parseFloat(styles.paddingRight) || 0;
  const borderTop = parseFloat(styles.borderTopWidth) || 0;
  const top = editor.offsetTop + borderTop + paddingTop + (state.searchHit.line - 1) * lineHeight - editor.scrollTop;
  const minTop = editor.offsetTop + borderTop;
  const maxTop = editor.offsetTop + editor.clientHeight - lineHeight;

  if (top < minTop || top > maxTop) {
    marker.classList.add("hidden");
    return;
  }

  marker.style.top = `${top}px`;
  marker.style.left = `${editor.offsetLeft + paddingLeft}px`;
  marker.style.right = `${editor.parentElement.clientWidth - editor.offsetLeft - editor.clientWidth + paddingRight}px`;
  marker.style.height = `${lineHeight}px`;
  marker.querySelector("span").textContent = t("searchHit", { line: state.searchHit.line });
  marker.classList.remove("hidden");
}

function parseVersionParts(version) {
  return String(version || "")
    .replace(/^v/i, "")
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);
}

function compareVersions(left, right) {
  const a = parseVersionParts(left);
  const b = parseVersionParts(right);
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i += 1) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function showUpdateNotice(meta) {
  if (!els.updateNotice || !meta || !meta.version) return;
  if (compareVersions(meta.version, PUBLIC_VERSION) <= 0) return;
  const url = meta.downloadUrl || meta.releaseUrl || UPDATE_HOME_URL;
  els.updateNotice.textContent = t("updateAvailable", { version: meta.version });
  els.updateNotice.title = t("updateOpen");
  els.updateNotice.dataset.url = url;
  els.updateNotice.classList.remove("hidden");
}

async function checkForUpdates() {
  if (!els.updateNotice) return;
  for (const url of UPDATE_CHECK_URLS) {
    try {
      const separator = url.includes("?") ? "&" : "?";
      const response = await fetch(url + separator + "t=" + Date.now(), { cache: "no-store" });
      if (!response.ok) continue;
      const meta = await response.json();
      showUpdateNotice(meta);
      return;
    } catch (_) {
      // Update checks are best-effort and must never block local editing.
    }
  }
}

function renderFiles() {
  const keyword = els.fileSearch.value.trim().toLowerCase();
  els.fileList.innerHTML = "";
  const shown = state.files.filter((item) => {
    const hay = `${item.name} ${item.path}`.toLowerCase();
    return !keyword || hay.includes(keyword);
  });

  for (const item of shown) {
    const button = document.createElement("button");
    button.className = `fileItem${item.path === state.currentPath ? " active" : ""}`;
    button.type = "button";
    button.innerHTML = `<strong></strong><span></span>`;
    button.querySelector("strong").textContent = item.name;
    button.querySelector("span").textContent = item.path;
    button.addEventListener("click", () => openFile(item.path));
    els.fileList.appendChild(button);
  }
}

async function loadFiles() {
  const data = await api(`/api/files?scope=${encodeURIComponent(state.scope)}`);
  state.files = data.files;
  const scopeLabel = state.scope === "novel" ? t("scopeNovel") : state.scope === "project" ? t("scopeProject") : t("scopeWorld");
  els.rootLabel.textContent = `${scopeLabel}: ${data.root}`;
  renderFiles();
}

function setLoadedFile(data) {
  clearSearchMarker();
  state.currentPath = data.path;
  state.baseHash = data.hash;
  state.savedContent = data.content;
  els.editor.value = data.content;
  els.fileTitle.textContent = data.name;
  els.filePath.textContent = data.path;
  els.renameFile.disabled = false;
  els.mtimeState.textContent = t("modifiedAt", { mtime: data.mtime });
  els.backupState.textContent = "";
  markDirty(false);
  updateStats();
  renderFiles();
  postSnapshot();
}

function normalizeWorkspacePath(path) {
  return String(path || "").replace(/\\/g, "/");
}

async function loadSessionSnapshot() {
  try {
    return await api("/api/session");
  } catch (_) {
    return null;
  }
}

function restoreDraft(snapshot) {
  if (!snapshot || !snapshot.currentPath || typeof snapshot.draft !== "string") return false;
  if (normalizeWorkspacePath(snapshot.currentPath) !== normalizeWorkspacePath(state.currentPath)) return false;
  if (!snapshot.dirty) return false;

  els.editor.value = snapshot.draft;
  markDirty(els.editor.value !== state.savedContent);
  const start = Math.max(0, Math.min(els.editor.value.length, Number(snapshot.selectionStart) || 0));
  const end = Math.max(start, Math.min(els.editor.value.length, Number(snapshot.selectionEnd) || start));
  els.editor.setSelectionRange(start, end);
  updateStats();
  els.backupState.textContent = t("draftRestored");
  postSnapshot();
  return true;
}

async function restoreSessionSnapshot(snapshot) {
  if (!snapshot || !snapshot.currentPath) return false;
  const data = await api(`/api/file?path=${encodeURIComponent(snapshot.currentPath)}`);
  setLoadedFile(data);
  restoreDraft(snapshot);
  updateEditorUrl(data.path);
  return true;
}

function updateEditorUrl(path, options = {}) {
  if (!path) return;
  const params = new URLSearchParams();
  params.set("path", path);
  if (options.line) params.set("line", String(options.line));
  if (options.column) params.set("column", String(options.column));
  if (options.matchLength) params.set("matchLength", String(options.matchLength));
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", nextUrl);
}

async function openFile(path) {
  if (state.dirty && !window.confirm(t("switchConfirm"))) {
    return;
  }
  const data = await api(`/api/file?path=${encodeURIComponent(path)}`);
  setLoadedFile(data);
  updateEditorUrl(data.path);
  els.editor.focus();
}

function getIndexAtLineColumn(text, line, column) {
  const lines = text.split("\n");
  let index = 0;
  for (let i = 0; i < Math.max(0, line - 1) && i < lines.length; i += 1) {
    index += lines[i].length + 1;
  }
  return Math.min(text.length, index + Math.max(0, column || 0));
}

async function openFileAt(path, line, column, matchLength = 0) {
  await openFile(path);
  const start = getIndexAtLineColumn(els.editor.value, line, column);
  const end = Math.min(els.editor.value.length, start + Math.max(0, matchLength));
  els.editor.focus();
  els.editor.setSelectionRange(start, end || start);
  const lineHeight = parseFloat(window.getComputedStyle(els.editor).lineHeight) || 28;
  els.editor.scrollTop = Math.max(0, (line - 4) * lineHeight);
  state.searchHit = { path, line, column, matchLength };
  updateSearchMarker();
  updateStats();
  postSnapshot();
  updateEditorUrl(path, { line, column, matchLength });
}

async function openManualPath() {
  const path = els.openPathInput.value.trim();
  if (!path) return;
  await openFile(path);
}

async function reloadCurrent() {
  if (!state.currentPath) return;
  if (state.dirty && !window.confirm(t("reloadConfirm"))) {
    return;
  }
  const data = await api(`/api/file?path=${encodeURIComponent(state.currentPath)}`);
  setLoadedFile(data);
}

async function showDiff() {
  if (!state.currentPath) return null;
  const data = await api("/api/diff", {
    method: "POST",
    body: JSON.stringify({
      path: state.currentPath,
      content: els.editor.value,
    }),
  });
  els.diffView.textContent = data.changed ? data.diff : t("noChanges");
  els.diffSummary.textContent = data.changed ? state.currentPath : t("noChangesSummary");
  els.diffDialog.showModal();
  return data;
}

async function saveCurrent() {
  if (!state.currentPath) return;
  try {
    const data = await api("/api/save", {
      method: "POST",
      body: JSON.stringify({
        path: state.currentPath,
        content: els.editor.value,
        baseHash: state.baseHash,
      }),
    });
    setLoadedFile(data);
    els.backupState.textContent = data.diffRecord
      ? t("backupDiffDone", { backup: data.backup, diff: data.diffRecord })
      : t("backupDone", { backup: data.backup });
  } catch (error) {
    els.saveState.className = "error";
    els.saveState.textContent = error.message;
    if (error.status === 409) {
      window.alert(t("conflictAlert"));
    } else {
      window.alert(error.message);
    }
  }
}

async function renameCurrentFile() {
  if (!state.currentPath) return;
  if (state.dirty) {
    window.alert(t("renameUnsaved"));
    return;
  }
  const currentName = state.currentPath.split("/").pop() || "";
  const raw = await openTextPrompt({
    title: t("renameFileTitle"),
    subtitle: t("renamePrompt"),
    value: currentName,
  });
  const newName = String(raw || "").trim();
  if (!newName || newName === currentName) return;
  try {
    const data = await api("/api/rename", {
      method: "POST",
      body: JSON.stringify({
        path: state.currentPath,
        name: newName,
      }),
    });
    setLoadedFile(data);
    updateEditorUrl(data.path);
    els.backupState.className = "muted";
    els.backupState.textContent = t("renameDone", { path: data.path });
  } catch (error) {
    window.alert(error.message);
  }
}

function formatHistoryStamp(stamp) {
  const match = String(stamp || "").match(/^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/);
  if (!match) return stamp || t("unknownTime");
  const [, y, mo, d, h, mi, s] = match;
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
}

function renderHistoryEntries(entries) {
  els.historyList.innerHTML = "";
  state.selectedHistory = null;
  els.restoreHistory.disabled = true;
  els.historyDiff.textContent = entries.length ? t("historyChoose") : t("historyEmpty");
  els.historySummary.textContent = entries.length ? t("historyCount", { count: entries.length }) : t("historyEmpty");

  for (const entry of entries) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "historyItem";
    const title = document.createElement("strong");
    title.textContent = formatHistoryStamp(entry.stamp);
    const meta = document.createElement("span");
    meta.textContent = `${Math.max(1, Math.round(entry.size / 1024))} KB · ${entry.path}`;
    button.append(title, meta);
    button.addEventListener("click", () => selectHistoryEntry(entry, button));
    els.historyList.appendChild(button);
  }
}

async function selectHistoryEntry(entry, button) {
  [...els.historyList.querySelectorAll(".historyItem")].forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  els.historyDiff.textContent = t("historyLoading");
  const data = await api(
    `/api/history/file?path=${encodeURIComponent(state.currentPath)}&backup=${encodeURIComponent(entry.id)}`,
  );
  state.selectedHistory = {
    ...entry,
    content: data.content,
    diff: data.changed ? data.diff : t("historySame"),
  };
  els.restoreHistory.disabled = false;
  els.historyDiff.textContent = state.selectedHistory.diff;
}

async function showHistory() {
  if (!state.currentPath) return;
  const data = await api(`/api/history?path=${encodeURIComponent(state.currentPath)}`);
  renderHistoryEntries(data.entries || []);
  els.historyDialog.showModal();
}

function restoreSelectedHistory() {
  if (!state.selectedHistory) return;
  if (state.dirty && !window.confirm(t("restoreConfirm"))) {
    return;
  }
  els.editor.value = state.selectedHistory.content;
  markDirty(els.editor.value !== state.savedContent);
  updateStats();
  scheduleSnapshot();
  els.backupState.textContent = t("restoredHistory", { stamp: formatHistoryStamp(state.selectedHistory.stamp) });
  els.historyDialog.close();
  els.editor.focus();
}

function renderSearchResults(results) {
  els.searchResults.innerHTML = "";
  if (!results.length) {
    els.searchSummary.textContent = t("noResults");
    return;
  }
  els.searchSummary.textContent = t("resultsCount", { count: results.length });
  for (const item of results) {
    const button = document.createElement("button");
    button.className = "searchResult";
    button.type = "button";
    const title = document.createElement("strong");
    title.textContent = `${item.name}:${item.line}`;
    const path = document.createElement("span");
    path.textContent = item.path;
    const excerpt = document.createElement("em");
    excerpt.textContent = item.excerpt;
    button.append(title, path, excerpt);
    button.addEventListener("click", () => openFileAt(item.path, item.line, item.column, item.matchLength));
    els.searchResults.appendChild(button);
  }
}

function lineColumnFromIndex(text, index) {
  const before = text.slice(0, index);
  const line = before.split("\n").length;
  const lastBreak = before.lastIndexOf("\n");
  return {
    line,
    column: index - lastBreak,
  };
}

function makeIssue(text, index, length, type, message) {
  const { line, column } = lineColumnFromIndex(text, index);
  const lineText = text.split("\n")[line - 1] || "";
  return {
    index,
    length: Math.max(1, length || 1),
    line,
    column,
    type,
    message,
    excerpt: lineText.trim().slice(0, 120),
  };
}

function findRegexIssues(text, regex, type, message) {
  const issues = [];
  for (const match of text.matchAll(regex)) {
    issues.push(makeIssue(text, match.index || 0, match[0].length, type, message(match[0])));
  }
  return issues;
}

function findBracketIssues(text) {
  const pairs = {
    "（": "）",
    "(": ")",
    "《": "》",
    "“": "”",
    "‘": "’",
    "[": "]",
    "【": "】",
  };
  const closing = Object.fromEntries(Object.entries(pairs).map(([open, close]) => [close, open]));
  const stack = [];
  const issues = [];

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (pairs[ch]) {
      stack.push({ ch, index: i });
    } else if (closing[ch]) {
      const last = stack[stack.length - 1];
      if (last && last.ch === closing[ch]) {
        stack.pop();
      } else {
        issues.push(makeIssue(text, i, 1, t("checkBracket"), t("issueExtraClose", { value: ch })));
      }
    }
  }

  for (const item of stack.slice(-20)) {
    issues.push(makeIssue(text, item.index, 1, t("checkBracket"), t("issueMissingClose", { value: pairs[item.ch] })));
  }
  return issues;
}

function validateCurrentText() {
  const text = els.editor.value;
  const issues = [
    ...findRegexIssues(text, /([，。！？、；：,.!?;:])\1+/g, t("checkDuplicatePunctuation"), (value) => t("issueDuplicate", { value })),
    ...findRegexIssues(text, /[\u4e00-\u9fff][,;:?!][\u4e00-\u9fff]/g, t("checkHalfPunctuation"), () => t("issueHalfPunctuation")),
    ...findRegexIssues(text, /\u3000/g, t("checkSpace"), () => t("issueFullWidthSpace")),
    ...findRegexIssues(text, /[ \t]{2,}/g, t("checkSpace"), () => t("issueMultiSpace")),
    ...findBracketIssues(text),
  ];
  return issues.sort((a, b) => a.index - b.index).slice(0, 300);
}

function jumpToIssue(issue) {
  if (!issue) return;
  if (state.showingPreview) togglePreview();
  els.editor.focus();
  els.editor.setSelectionRange(issue.index, issue.index + issue.length);
  const lineHeight = parseFloat(window.getComputedStyle(els.editor).lineHeight) || 28;
  els.editor.scrollTop = Math.max(0, (issue.line - 5) * lineHeight);
  updateStats();
}

function renderCheckResults(issues) {
  els.checkResults.innerHTML = "";
  if (!issues.length) {
    els.checkSummary.textContent = t("checkClean");
    const empty = document.createElement("p");
    empty.className = "emptyState";
    empty.textContent = t("checkCleanBody");
    els.checkResults.appendChild(empty);
    return;
  }

  els.checkSummary.textContent = t("checkCount", { count: issues.length });
  for (const issue of issues) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "checkItem";
    const title = document.createElement("strong");
    title.textContent = `${issue.type} · ${t("cursor", { line: issue.line, col: issue.column })}`;
    const message = document.createElement("span");
    message.textContent = issue.message;
    const excerpt = document.createElement("em");
    excerpt.textContent = issue.excerpt || t("issueEmptyLine");
    button.append(title, message, excerpt);
    button.addEventListener("click", () => {
      els.checkDialog.close();
      jumpToIssue(issue);
    });
    els.checkResults.appendChild(button);
  }
}

function showChecks() {
  if (!state.currentPath) return;
  const issues = validateCurrentText();
  renderCheckResults(issues);
  els.checkDialog.showModal();
}

function afterProgrammaticEdit() {
  clearSearchMarker();
  markDirty(els.editor.value !== state.savedContent);
  updateStats();
  scheduleSnapshot();
}

function wrapSelection(prefix, suffix, placeholder) {
  if (!state.currentPath || state.showingPreview) return;
  const start = els.editor.selectionStart || 0;
  const end = els.editor.selectionEnd || start;
  const selected = els.editor.value.slice(start, end) || placeholder;
  const replacement = `${prefix}${selected}${suffix}`;
  els.editor.focus();
  els.editor.setRangeText(replacement, start, end, "select");
  els.editor.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
  afterProgrammaticEdit();
}

function getSelectedLineRange() {
  const text = els.editor.value;
  const start = els.editor.selectionStart || 0;
  const end = els.editor.selectionEnd || start;
  const lineStart = text.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  let lineEnd = text.indexOf("\n", end);
  if (lineEnd === -1) lineEnd = text.length;
  return { lineStart, lineEnd };
}

function toggleLinePrefix(prefix) {
  if (!state.currentPath || state.showingPreview) return;
  const { lineStart, lineEnd } = getSelectedLineRange();
  const segment = els.editor.value.slice(lineStart, lineEnd);
  const lines = segment.split("\n");
  const hasPrefix = lines.every((line) => !line.trim() || line.startsWith(prefix));
  const replacement = lines
    .map((line) => {
      if (!line.trim()) return line;
      return hasPrefix ? line.slice(prefix.length) : `${prefix}${line}`;
    })
    .join("\n");
  els.editor.focus();
  els.editor.setRangeText(replacement, lineStart, lineEnd, "select");
  afterProgrammaticEdit();
}

function toggleOrderedList() {
  if (!state.currentPath || state.showingPreview) return;
  const { lineStart, lineEnd } = getSelectedLineRange();
  const segment = els.editor.value.slice(lineStart, lineEnd);
  const lines = segment.split("\n");
  const hasPrefix = lines.every((line) => !line.trim() || /^\d+\.\s/.test(line));
  let index = 1;
  const replacement = lines
    .map((line) => {
      if (!line.trim()) return line;
      return hasPrefix ? line.replace(/^\d+\.\s/, "") : `${index++}. ${line}`;
    })
    .join("\n");
  els.editor.focus();
  els.editor.setRangeText(replacement, lineStart, lineEnd, "select");
  afterProgrammaticEdit();
}

function insertAtCursor(text, selectOffset = 0, selectLength = 0) {
  if (!state.currentPath || state.showingPreview) return;
  const start = els.editor.selectionStart || 0;
  const end = els.editor.selectionEnd || start;
  els.editor.focus();
  els.editor.setRangeText(text, start, end, "end");
  if (selectLength > 0) {
    els.editor.setSelectionRange(start + selectOffset, start + selectOffset + selectLength);
  }
  afterProgrammaticEdit();
}

function insertHorizontalRule() {
  const pos = els.editor.selectionStart || 0;
  const before = els.editor.value.slice(0, pos);
  const after = els.editor.value.slice(pos);
  const prefix = before.endsWith("\n") || before.length === 0 ? "" : "\n";
  const suffix = after.startsWith("\n") || after.length === 0 ? "" : "\n";
  insertAtCursor(`${prefix}---${suffix}`);
}

function insertLink() {
  if (!state.currentPath || state.showingPreview) return;
  const start = els.editor.selectionStart || 0;
  const end = els.editor.selectionEnd || start;
  const selected = els.editor.value.slice(start, end) || t("linkTextPlaceholder");
  const replacement = `[${selected}](https://)`;
  els.editor.focus();
  els.editor.setRangeText(replacement, start, end, "select");
  const urlStart = start + selected.length + 3;
  els.editor.setSelectionRange(urlStart, urlStart + 8);
  afterProgrammaticEdit();
}

function applyFormat(action) {
  const actions = {
    bold: () => wrapSelection("**", "**", t("boldPlaceholder")),
    italic: () => wrapSelection("*", "*", t("italicPlaceholder")),
    h1: () => toggleLinePrefix("# "),
    h2: () => toggleLinePrefix("## "),
    quote: () => toggleLinePrefix("> "),
    list: () => toggleLinePrefix("- "),
    "ordered-list": toggleOrderedList,
    "inline-code": () => wrapSelection("`", "`", t("codePlaceholder")),
    strike: () => wrapSelection("~~", "~~", t("strikePlaceholder")),
    link: insertLink,
    hr: insertHorizontalRule,
  };
  actions[action]?.();
}

async function runContentSearch() {
  const query = els.contentSearch.value.trim();
  if (!query) {
    els.searchResults.innerHTML = "";
    els.searchSummary.textContent = t("notSearched");
    return;
  }
  els.searchSummary.textContent = t("searching");
  const data = await api(`/api/search?scope=${encodeURIComponent(state.scope)}&q=${encodeURIComponent(query)}`);
  renderSearchResults(data.results || []);
}

function formatActivityEvent(event) {
  const body = { ...event };
  delete body.ts;
  delete body.event;
  delete body.client;
  return `[${event.ts}] ${event.event}\n${JSON.stringify(body, null, 2)}`;
}

async function showActivity() {
  const data = await api("/api/activity?limit=120");
  els.activityView.textContent = (data.events || []).map(formatActivityEvent).join("\n\n") || t("noActivity");
  els.activityDialog.showModal();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*/g, "$1<em>$2</em>");
}

function renderMarkdown(text) {
  const blocks = text.split(/\n{2,}/);
  return blocks
    .map((block) => {
      const raw = block.trim();
      const safe = renderInlineMarkdown(escapeHtml(raw));
      if (!raw) return "";
      if (raw.startsWith("# ")) return `<h1>${renderInlineMarkdown(escapeHtml(raw.slice(2)))}</h1>`;
      if (raw.startsWith("## ")) return `<h2>${renderInlineMarkdown(escapeHtml(raw.slice(3)))}</h2>`;
      if (raw.startsWith("### ")) return `<h3>${renderInlineMarkdown(escapeHtml(raw.slice(4)))}</h3>`;
      if (raw.startsWith("> ")) return `<blockquote>${renderInlineMarkdown(escapeHtml(raw.slice(2))).replace(/\n&gt; /g, "<br>")}</blockquote>`;
      return `<p>${safe.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

function togglePreview() {
  state.showingPreview = !state.showingPreview;
  if (state.showingPreview) {
    updateSearchMarker();
    updateCaretLineMarker();
    els.preview.innerHTML = renderMarkdown(els.editor.value);
    els.preview.classList.remove("hidden");
    els.editor.classList.add("hidden");
    els.lineNumbers.classList.add("hidden");
    els.togglePreview.textContent = t("returnEdit");
  } else {
    els.preview.classList.add("hidden");
    els.editor.classList.remove("hidden");
    els.lineNumbers.classList.remove("hidden");
    els.togglePreview.textContent = t("previewMarkdown");
    els.editor.focus();
    syncLineNumberScroll();
    updateCaretLineMarker();
    updateSearchMarker();
  }
}

async function postSnapshot() {
  if (!state.currentPath) return;
  const draft = els.editor.value;
  try {
    await api("/api/session", {
      method: "POST",
      body: JSON.stringify({
        currentPath: state.currentPath,
        dirty: state.dirty,
        selectionStart: els.editor.selectionStart || 0,
        selectionEnd: els.editor.selectionEnd || 0,
        chars: draft.replace(/\s/g, "").length,
        draftHash: hashText(draft),
        draft,
      }),
    });
  } catch (_) {
    // The editor remains usable even if the live snapshot cannot be written.
  }
}

function scheduleSnapshot() {
  window.clearTimeout(state.snapshotTimer);
  state.snapshotTimer = window.setTimeout(postSnapshot, 500);
}

async function createFolder() {
  const raw = await openTextPrompt({
    title: t("createFolder"),
    subtitle: t("createFolderPrompt"),
  });
  const path = String(raw || "").trim();
  if (!path) return;
  try {
    const data = await api("/api/folder", {
      method: "POST",
      body: JSON.stringify({ scope: state.scope, path }),
    });
    els.backupState.className = "muted";
    els.backupState.textContent = t("createFolderDone", { path: data.path });
    await loadFiles();
  } catch (error) {
    window.alert(error.message);
  }
}

els.editor.addEventListener("input", () => {
  clearSearchMarker();
  markDirty(els.editor.value !== state.savedContent);
  updateStats();
  scheduleSnapshot();
});
els.editor.addEventListener("keyup", () => {
  updateStats();
  scheduleSnapshot();
});
els.editor.addEventListener("click", () => {
  updateStats();
  scheduleSnapshot();
});
els.editor.addEventListener("scroll", () => {
  syncLineNumberScroll();
  updateCaretLineMarker();
  updateSearchMarker();
});
els.scopeSelect.addEventListener("change", () => {
  state.scope = els.scopeSelect.value;
  loadFiles();
});
els.openPathButton.addEventListener("click", openManualPath);
els.openPathInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    openManualPath();
  }
});
els.fileSearch.addEventListener("input", renderFiles);
els.contentSearchButton.addEventListener("click", runContentSearch);
els.contentSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    runContentSearch();
  }
});
els.refreshFiles.addEventListener("click", loadFiles);
els.reloadFile.addEventListener("click", reloadCurrent);
els.renameFile.addEventListener("click", renameCurrentFile);
els.historyFile.addEventListener("click", showHistory);
els.checkFile.addEventListener("click", showChecks);
els.previewDiff.addEventListener("click", showDiff);
els.saveFile.addEventListener("click", showDiff);
els.togglePreview.addEventListener("click", togglePreview);
els.showActivity.addEventListener("click", showActivity);
els.createFolder.addEventListener("click", createFolder);
els.updateNotice?.addEventListener("click", () => {
  const url = els.updateNotice.dataset.url || UPDATE_HOME_URL;
  window.open(url, "_blank", "noopener,noreferrer");
});
els.restoreHistory.addEventListener("click", restoreSelectedHistory);
els.themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
});
els.accentButtons.forEach((button) => {
  button.addEventListener("click", () => setAccent(button.dataset.accent));
});
els.editorFontFamily.addEventListener("change", () => {
  state.viewPrefs.fontFamily = els.editorFontFamily.value;
  saveViewPrefs();
  applyViewPrefs();
});
els.editorFontSize.addEventListener("change", () => {
  setEditorFontSize(Number(els.editorFontSize.value) || 17);
});
els.editorLineHeight.addEventListener("change", () => {
  state.viewPrefs.lineHeight = Number(els.editorLineHeight.value) || 1.85;
  saveViewPrefs();
  applyViewPrefs();
});
els.localeSelect.addEventListener("change", () => requestLocale(els.localeSelect.value));
els.localePolicyCopy.addEventListener("click", () => {
  els.localePolicyInput.value = requiredPolicyPhrase(state.pendingLocale);
  els.localePolicyError.textContent = "";
  els.localePolicyInput.focus();
});
els.localePolicyConfirm.addEventListener("click", confirmLocalePolicy);
els.textPromptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    els.textPromptConfirm.click();
  }
});
els.localePolicyDialog.addEventListener("close", () => {
  if (state.pendingLocale) {
    els.localeSelect.value = state.locale;
    state.pendingLocale = "";
  }
});
els.formatButtons.forEach((button) => {
  button.addEventListener("click", () => applyFormat(button.dataset.format));
});
els.editor.addEventListener("wheel", (event) => {
  if (!event.ctrlKey && !event.metaKey) return;
  event.preventDefault();
  const direction = event.deltaY < 0 ? 1 : -1;
  setEditorFontSize(state.viewPrefs.fontSize + direction);
}, { passive: false });
els.confirmSave.addEventListener("click", (event) => {
  event.preventDefault();
  els.diffDialog.close();
  saveCurrent();
});

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    showDiff();
  } else if (document.activeElement === els.editor && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
    event.preventDefault();
    applyFormat("bold");
  } else if (document.activeElement === els.editor && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "i") {
    event.preventDefault();
    applyFormat("italic");
  }
});

window.addEventListener("resize", () => {
  state.lineMetricsKey = "";
  updateStats();
  updateSearchMarker();
});

window.addEventListener("beforeunload", (event) => {
  if (!state.dirty) return;
  event.preventDefault();
  event.returnValue = "";
});

function parsePositiveInt(raw, fallback = 0) {
  const value = Number.parseInt(raw || "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function scopeForPath(path) {
  return state.scope || "novel";
}

function getInitialOpenTarget() {
  const params = new URLSearchParams(window.location.search);
  const path = params.get("path") || params.get("file") || "";
  if (!path) return null;
  return {
    path,
    line: parsePositiveInt(params.get("line")),
    column: Math.max(0, Number.parseInt(params.get("column") || "0", 10) || 0),
    matchLength: Math.max(0, Number.parseInt(params.get("matchLength") || "0", 10) || 0),
  };
}

async function openInitialPathFromUrl() {
  const target = getInitialOpenTarget();
  if (!target) return;
  const nextScope = scopeForPath(target.path);
  if (nextScope !== state.scope) {
    state.scope = nextScope;
    els.scopeSelect.value = nextScope;
    await loadFiles();
  }
  if (target.line) {
    await openFileAt(target.path, target.line, target.column, target.matchLength);
  } else {
    await openFile(target.path);
  }
}

async function boot() {
  loadLocalePreference();
  loadTheme();
  applyTheme();
  loadAccent();
  applyAccent();
  loadViewPrefs();
  applyViewPrefs();
  applyLocaleStaticText();
  await loadFiles();
  const snapshot = await loadSessionSnapshot();
  const target = getInitialOpenTarget();
  if (target) {
    await openInitialPathFromUrl();
    restoreDraft(snapshot);
  } else {
    await restoreSessionSnapshot(snapshot);
  }
}

boot().catch((error) => {
  els.saveState.className = "error";
  els.saveState.textContent = error.message;
});
