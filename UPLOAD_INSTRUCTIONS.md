# 上传到 GitHub 的步骤

## 如果这是第一次上传：

```bash
# 1. 初始化 git 仓库（如果还没有）
git init

# 2. 添加远程仓库
git remote add origin https://github.com/Lesley-Qing-Gu/profile.git

# 3. 添加所有文件
git add .

# 4. 提交更改
git commit -m "Update color schemes for all buildings"

# 5. 推送到 GitHub
git push -u origin main
```

## 如果已经有 git 仓库：

```bash
# 1. 添加所有更改
git add .

# 2. 提交更改
git commit -m "Update color schemes for all buildings"

# 3. 推送到 GitHub
git push
```

## 注意事项：
- 确保您已经登录 GitHub 账户
- 如果遇到权限问题，可能需要设置 GitHub Personal Access Token
- 如果主分支名称是 master 而不是 main，请将命令中的 main 改为 master
