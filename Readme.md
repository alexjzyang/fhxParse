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
