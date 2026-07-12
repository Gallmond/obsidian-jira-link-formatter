# Obsidian Jira Link Formatter

I like to take notes at work in obsidian, including todo lists that refer to JIRA tickets. However I don't like how much space the full links take:

```md
// Lots of space
- http//example.atlassian.net/browse/ISSUE-1234 - Update the thing

// Much better, clickable issue id name
- ISSUE-1234 - Update the thing
```

This necessitates a markdown link like so:
`[ISSUE-1234](http//example.atlassian.net/browse/ISSUE-1234)`

Which is tedious to do over and over.

## Usage

First set the domain of your jira isntance in the settings

<img width="845" height="419" alt="image" src="https://github.com/user-attachments/assets/e15a6078-44a7-469c-bd7a-2d02f8dadaa9" />

Then, any time you paste a jira issue link where:
- it uses your configured domain in settings (case insensitive)
- the issue id is [valid format](#jira-issue-id-format)
- the url is valid

It will automatically arrive in the document as a markdown link.

```
pasting 'https://company.atlassian.net/browse/TIC-123'
becomes '[TIC-123](https://company.atlassian.net/browse/TIC-123)' 

pasting 'https://company.atlassian.net/browse/TIC-123#anchor'
becomes '[TIC-123](https://company.atlassian.net/browse/TIC-123#anchor)'

pasting 'https://company.atlassian.net/browse/TIC-123#anchor?query=string'
becomes '[TIC-123](https://company.atlassian.net/browse/TIC-123#anchor?query=string)'

pasting 'company.atlassian.net/browse/TIC-123'
becomes '[TIC-123](https://company.atlassian.net/browse/TIC-123)'

pasting 'custom.domain.com/weird/path/TIC-123/even/after'
becomes '[TIC-123](https://custom.domain.com/weird/path/TIC-123/even/after)'
```

### Jira issue id format
The issue id (i.e.: `TIC-123` above) consists of `<project-key>-<issue number>` where project key:
- is upper-case
- Starts with a letter
- Only contains `A-Z`, `0-9`, or `_`
