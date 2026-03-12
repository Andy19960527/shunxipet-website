# Jinhua Shunxi 网站部署指南

## 域名信息
- **域名**：shunxipet.com
- **前台**：https://shunxipet.com
- **后台**：https://shunxipet.com/admin

---

## 🔐 后台管理密码
- **默认密码**：`Shunxi@2024`
- **登录地址**：https://shunxipet.com/admin
- ⚠️ 建议部署后修改密码（在 Vercel 环境变量中设置 `VITE_ADMIN_PASSWORD`）

---

## 🚀 部署到 Vercel（5分钟完成）

### 第一步：上传代码到 GitHub

1. **登录 GitHub**：https://github.com
2. **创建新仓库**：
   - 点击右上角 "+" → "New repository"
   - Repository name：`shunxipet-website`
   - 选择 "Public"
   - 点击 "Create repository"

3. **上传代码**（两种方式任选）：

   **方式A：网页拖拽上传（最简单）**
   - 点击 "uploading an existing file"
   - 将项目文件夹中所有文件拖入
   - 点击 "Commit changes"

   **方式B：Git 命令上传**
   ```bash
   cd 你的项目目录
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/shunxipet-website.git
   git push -u origin main
   ```

---

### 第二步：Vercel 部署

1. **登录 Vercel**：https://vercel.com（用 GitHub 登录）

2. **导入项目**：
   - 点击 "Add New..." → "Project"
   - 选择 `shunxipet-website` 仓库
   - 点击 "Import"

3. **配置环境变量**（重要！）：
   - 展开 "Environment Variables"
   - 添加以下变量：

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://br-tough-dory-d8df92f1.supabase2.aidap-global.cn-beijing.volces.com` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNTM4MTM5MjIsInJvbGUiOiJhbm9uIn0.ex0qFXg7cosF1yxQUA3VbehU7EJIuty97DO07jvvS_E` |
   | `VITE_ADMIN_PASSWORD` | `Shunxi@2024` |

4. **部署**：
   - 点击 "Deploy"
   - 等待 1-2 分钟
   - 看到 🎉 庆祝动画表示部署成功！

---

### 第三步：绑定域名

1. **在 Vercel 添加域名**：
   - 进入项目 → "Settings" → "Domains"
   - 输入 `shunxipet.com`
   - 点击 "Add"

2. **配置 DNS 解析**（在域名购买商后台）：
   
   登录你购买域名的平台（Namecheap/GoDaddy/阿里云等），找到 DNS 设置：

   | 类型 | 名称 | 值 | TTL |
   |------|------|-----|-----|
   | A | @ | 76.76.21.21 | 自动 |
   | CNAME | www | cname.vercel-dns.com | 自动 |

3. **等待生效**：
   - DNS 解析需要 5-30 分钟
   - 完成后访问 https://shunxipet.com 即可看到网站

---

## ✅ 部署完成检查清单

- [ ] 代码已上传到 GitHub
- [ ] Vercel 项目已创建
- [ ] 环境变量已配置（3个）
- [ ] 部署成功
- [ ] 域名 DNS 已配置
- [ ] 网站可以正常访问
- [ ] 后台可以正常登录

---

## 📝 后续维护

### 修改产品信息
1. 访问 https://shunxipet.com/admin
2. 输入密码：`Shunxi@2024`
3. 添加/编辑/删除产品

### 修改后台密码
1. 登录 Vercel → 你的项目 → Settings → Environment Variables
2. 修改 `VITE_ADMIN_PASSWORD` 的值
3. 点击 "Save"
4. 重新部署项目（Deployments → 最新的部署 → Redeploy）

---

## 💰 费用说明

| 项目 | 费用 |
|------|------|
| Vercel 托管 | **免费** |
| 域名 | **已购买** |
| 总计 | **$0/年** |

---

## ❓ 常见问题

**Q: 网站打不开？**
- 检查 Vercel 部署状态
- 检查 DNS 解析是否正确
- 等待 DNS 生效（最多30分钟）

**Q: 后台登录不了？**
- 确认环境变量已配置
- 确认密码正确
- 清除浏览器缓存重试

**Q: 数据丢失了？**
- 数据存储在 Supabase 数据库，不会丢失
- 如果换项目，需要重新配置环境变量

---

**祝你的网站上线顺利！🎉**
