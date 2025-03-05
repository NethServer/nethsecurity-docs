==========================
NethSecurity documentation
==========================

Sphinx documentation sources for NethSecurity documentation.

Under the root directory there are some special files:

* conf.py: Sphinx configuration
* Makefile: Sphinx build makefile
* index.rst: document structure

All other ``.rst`` files are chapters of the manual. If you wish to add a new
chapter, create a new file and add it to the index.rst file.

How to contribute
=================

The easiest way to contribute is by forking and editing the repository 
directly on GitHub:

* Create a GitHub account if you don't already have it
* Go to https://github.com/NethServer/nethsecurity-docs and fork the project
* You can now edit any page using GitHub web interface and see a live preview of the output
* When you're done, simply create a new pull request
* A new automatic build is launched after the pull request is merged by a developer

While editing, please follow the guidelines below.

Editing guidelines
------------------

The document must start with a title such as ::

    ==============
    Document title
    ==============

Make sure to add only *one* first-level title for each rst file.

Next headers levels are::

    First level
    ===========

    Second level
    ------------

    Third level
    ^^^^^^^^^^^

    Fourth level
    ~~~~~~~~~~~~


To create cross-references set a label before headers, with ``-section`` suffix::

    .. _mytitle-section:

    My title
    --------

In other documents refer to "My title" with the ``:ref:`` command::
    
    More information can be found at :ref:`mytitle-section`
    

Use the \* character for unordered list ::
 
    * First element
    * Second element

Use a definition list when describing fields ::

    My field
        This is my description

A field description can also contain a bullet list ::

    My field
        This is my description

        * First element
        * Second element

Highlight important words ::
   
    This is an *important* word.
    
Add notes with ::
    
    .. note:: Highlight this text

Add warnings with ::

    .. warning:: Warning text fragment

Other conventions:

* use double backtick to quote labels and links from the web user interface
* use ``guilabel`` markup for buttons
    
You can find more info about **RST Inline Markup** here: rst-cheatsheet_

.. _rst-cheatsheet: https://github.com/ralsina/rst-cheatsheet/blob/master/rst-cheatsheet.rst
 
Use a spell checker program before submitting a pull request. For instance run ::

  hunspell -d en_US <filename>

Build documentation
===================

Whenever there are modifications, a build process will be launched from CI.

If you want to build the documentation locally on your machine, make sure to install the Sphinx package.

On Fedora 37 or later use: ::

  sudo dnf install python3-sphinx python3-pip make

The local build uses a Python virtual environment.
First clone the repository, change into the cloned directory and setup the virtual env ::

  git clone https://github.com/NethServer/nethsecurity-docs.git
  cd nethsecurity-docs
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt

Finally, build the doc: ::

   make html

Localization workflow
---------------------

The CI will update source translation files after every commit.

To generate po files locally for a new language: ::

   make gettext
   sphinx-intl update -p _build/gettext -l it

You can contribute to the translation by accessing `Weblate <https://hosted.weblate.org/projects/ns8/nethsecurity-docs/>`_.

Documentation style guidelines
==============================

When editing documents, please keep in mind the following guidelines:

* https://www.writethedocs.org/blog/newsletter-december-2016/#simplifying-and-tightening-your-writing
* https://www.writethedocs.org/blog/newsletter-october-2022/#gerunds-in-headings
* https://www.writethedocs.org/blog/newsletter-september-2022/#when-to-use-acronyms
* https://www.writethedocs.org/blog/newsletter-november-2019/#you-sing-the-second-person-in-documentation
* https://www.writethedocs.org/blog/newsletter-may-2018/#using-imperatives-in-documentation
* https://www.writethedocs.org/blog/newsletter-july-2017/#documenting-unlabeled-buttons
* https://learn.microsoft.com/en-us/style-guide/global-communications/writing-tips
