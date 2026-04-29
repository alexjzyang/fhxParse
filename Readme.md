# fhxParse

## Initial Setup

### Clone the Repository with Submodules

Since this project uses Git submodules, clone with the `--recurse-submodules` flag:

```bash
git clone --recurse-submodules https://github.com/alexjzyang/fhxParse.git
cd fhxParse
```

### Pull Large Files from Git LFS

This project uses Git LFS (Large File Storage) for test data and other large files in both the main repository and submodules. After cloning, pull all LFS files:

```bash
git lfs pull --recursive
```

### If You Already Cloned Without Submodules

Initialize and fetch submodules:

```bash
git submodule update --init --recursive
```

### Install Dependencies

```bash
npm install
```

## Scripts for cloning and updating repo

### Daily Update

```
# update FHX files inside the submodule
cd FHX-Files

# make changes, commit, push
git add ...
git commit -m "Update FHX dataset"
git push origin main

# then in fhxParse bump the submodule ref
cd ..
git add FHX-Files
git commit -m "Update submodule pointer"
git push origin main
```

### Fresh Clone

```
git lfs install
git clone --recurse-submodules <main-repo-url>
cd fhxParse
git submodule update --init --recursive
git lfs pull --all
```

### Existing clone

```
git lfs install
git pull origin main
git submodule update --init --recursive
git lfs pull --all
```

