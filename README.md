# 坦克大战网页游戏

一个使用HTML5 Canvas开发的经典坦克大战游戏。

## 🎮 游戏特性

- 玩家控制的坦克（绿色）
- AI敌人坦克（红色）
- 子弹系统和碰撞检测
- 随机生成的障碍物
- 得分和生命系统

## 🕹️ 游戏控制

- **WASD** 或 **方向键** - 移动坦克
- **空格键** 或 **鼠标左键** - 发射子弹

## 📦 本地运行

1. 下载所有文件到本地
2. 在项目目录下运行：
   ```bash
   python -m http.server 8000
   ```
3. 在浏览器中打开 `http://localhost:8000`

## 🌐 发布到互联网

### 方法一：GitHub Pages（推荐，免费）

1. **创建GitHub账号**（如果还没有）
    - 访问 https://github.com
    - 注册账号

2. **创建新仓库**
    - 点击右上角 "+" → "New repository"
    - 仓库名：`tank-game`（或任意名称）
    - 选择 Public（公开）
    - 勾选 "Add a README file"
    - 点击 "Create repository"

3. **上传文件**
    - 在仓库页面点击 "uploading an existing file"
    - 拖拽以下文件到页面：
        - `index.html`
        - `style.css`
        - `game.js`
    - 点击 "Commit changes"

4. **启用GitHub Pages**
    - 进入仓库 Settings（设置）
    - 左侧菜单找到 "Pages"
    - Source 选择 "Deploy from a branch"
    - Branch 选择 "main" 或 "master"，文件夹选择 "/ (root)"
    - 点击 "Save"

5. **访问你的游戏**
    - 几分钟后，访问：`https://你的用户名.github.io/tank-game`
    - 例如：`https://zhangsan.github.io/tank-game`

### 方法二：Netlify（简单快速，免费）

1. **访问 Netlify**
    - 打开 https://www.netlify.com
    - 使用GitHub账号登录（或注册）

2. **部署网站**
    - 点击 "Add new site" → "Deploy manually"
    - 将整个项目文件夹拖拽到页面
    - 等待部署完成

3. **获取链接**
    - 部署完成后会得到一个随机域名
    - 例如：`https://amazing-tank-game-123.netlify.app`
    - 可以在设置中修改为自定义域名

### 方法三：Vercel（免费，快速）

1. **访问 Vercel**
    - 打开 https://vercel.com
    - 使用GitHub账号登录

2. **导入项目**
    - 点击 "Add New Project"
    - 选择你的GitHub仓库（需要先上传到GitHub）
    - 或直接拖拽文件夹上传

3. **部署**
    - 点击 "Deploy"
    - 等待几秒钟即可完成

### 方法四：使用Git命令行（适合开发者）

如果你熟悉Git，可以使用命令行：

```bash
# 1. 初始化Git仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Initial commit: Tank game"

# 4. 在GitHub创建仓库后，添加远程仓库
git remote add origin https://github.com/你的用户名/tank-game.git

# 5. 推送到GitHub
git branch -M main
git push -u origin main
```

然后按照方法一的步骤4启用GitHub Pages。

## 📝 注意事项

- 确保所有文件（index.html, style.css, game.js）都在同一目录
- GitHub Pages可能需要几分钟才能生效
- 如果使用GitHub Pages，确保仓库是Public（公开的）
- 分享链接时，确保链接以 `https://` 开头

## 🔗 快速链接

- [GitHub](https://github.com)
- [Netlify](https://www.netlify.com)
- [Vercel](https://vercel.com)

## 📄 许可证

本项目为开源项目，可自由使用和修改。

