# 🚀 Shunxi Pet 网站部署清单

> Vercel 审核通过后，按此清单操作即可上线

---

## 📦 项目信息

| 项目 | 内容 |
|------|------|
| 域名 | shunxipet.com |
| 后台密码 | `Shunxi@2024` |
| 数据库 | Supabase (已配置) |

---

## 🔑 环境变量（重要！）

在 Vercel 中添加以下 3 个环境变量：

```
VITE_SUPABASE_URL=https://br-tough-dory-d8df92f1.supabase2.aidap-global.cn-beijing.volces.com
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNTM4MTM5MjIsInJvbGUiOiJhbm9uIn0.ex0qFXg7cosF1yxQUA3VbehU7EJIuty97DO07jvvS_E
VITE_ADMIN_PASSWORD=Shunxi@2024
```

---

## ✅ 部署步骤

### Step 1: 上传代码到 GitHub

1. 登录 GitHub → 创建新仓库 `shunxipet-website`
2. 上传项目所有文件

### Step 2: Vercel 部署

1. 登录 Vercel (用 GitHub 账号)
2. Import Project → 选择 `shunxipet-website`
3. 添加环境变量（见上方）
4. 点击 Deploy

### Step 3: 绑定域名

1. Vercel → Settings → Domains
2. 添加 `shunxipet.com`
3. 在域名管理后台配置 DNS：

| 类型 | 名称 | 值 |
|------|------|-----|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

---

## 🌐 网站地址

| 页面 | 地址 |
|------|------|
| 前台首页 | https://shunxipet.com |
| 后台管理 | https://shunxipet.com/admin |

---

## 📋 上线检查

- [ ] Vercel 审核通过
- [ ] 代码上传 GitHub
- [ ] Vercel 导入项目
- [ ] 环境变量已配置
- [ ] 部署成功
- [ ] DNS 解析已配置
- [ ] 前台访问正常
- [ ] 后台登录正常
- [ ] 产品显示正常

---

## 🛠 后续维护

### 修改产品
访问 `/admin`，输入密码后即可管理产品

### 修改密码
在 Vercel 环境变量中修改 `VITE_ADMIN_PASSWORD`，然后重新部署

---

**准备就绪，祝上线顺利！🎉**
