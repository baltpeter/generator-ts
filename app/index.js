import isScoped from 'is-scoped';
import Generator from 'yeoman-generator';

export default class extends Generator {
    _arg(name) {
        return this.options[name] || this.answers[name];
    }

    constructor(args, opts) {
        super(args, opts);

        // https://github.com/yeoman/generator/issues/1294#issuecomment-841668595
        this.env.options.nodePackageManager = 'yarn';

        this.argument('moduleName', {
            type: String,
            required: false,
            description: 'The name of the module (this will also be the output directory).',
        });
        this.option('description', {
            type: String,
            description: 'A short one-sentence description of the module.',
        });
        this.option('name', {
            type: String,
            description: 'Your name.',
        });
        this.option('email', {
            type: String,
            description: 'Your email.',
        });
        this.option('githubRepo', {
            type: String,
            description: 'The GitHub repository where the module will be stored.',
        });
    }

    async prompting() {
        const githubUsername = await this.user.github.username();

        this.answers = await this.prompt([
            {
                name: 'moduleName',
                message: 'What should the module be called on NPM (this will also be the output directory)?',
                validate: (m) => m.length > 0 || 'You have to provide a name for the module.',
                when: !this.options.moduleName,
            },
            {
                name: 'description',
                message: 'Give a short one-sentence description of the module.',
                validate: (d) => d.length > 0 || 'You have to provide a description for the module.',
            },
            {
                name: 'name',
                message: 'What is your name?',
                default: this.user.git.name,
                store: true,
            },
            {
                name: 'email',
                message: 'What is your email?',
                default: this.user.git.email,
                store: true,
            },
            {
                name: 'githubRepo',
                message: 'In what GitHub repository will the module be stored?',
                default: (answers) => {
                    if (!githubUsername) return undefined;
                    const moduleName = answers.moduleName || this.options.moduleName;
                    const repoName = isScoped(moduleName) ? moduleName.split('/')[1] : moduleName;
                    return `${githubUsername}/${repoName}`;
                },
            },
            {
                name: 'accessPublic',
                description: 'Do you want to make the module public?',
                type: 'confirm',
                when: (answers) => isScoped(answers.moduleName || this.options.moduleName),
            },
        ]);
    }

    async writing() {
        const arg = (name) => this.options[name] || this.answers[name];

        const outDir = isScoped(arg('moduleName')) ? arg('moduleName').split('/')[1] : arg('moduleName');
        this.destinationRoot(this.destinationPath(outDir));
        this.env.cwd = this.destinationPath();

        this.spawnCommandSync('git', ['init'], { cwd: this.destinationPath() });

        const tpl = {
            moduleName: arg('moduleName'),
            description: arg('description'),
            year: new Date().getFullYear(),
            name: arg('name'),
            email: arg('email'),
            githubRepo: arg('githubRepo'),
            accessPublic: arg('accessPublic'),
        };

        this.fs.copyTpl(this.templatePath('**/*'), this.destinationPath(), tpl, undefined, {
            globOptions: { dot: true },
        });

        // Apart from husky, we always want the latest versions of these, so we are adding them here instead of in the
        // package.json.
        await this.addDevDependencies([
            '@baltpeter/eslint-config',
            '@baltpeter/prettier-config',
            '@baltpeter/tsconfig',
            '@parcel/packager-ts',
            '@parcel/transformer-typescript-types',
            '@typescript-eslint/eslint-plugin',
            'eslint',
            'eslint-plugin-eslint-comments',
            'eslint-plugin-import',
            'husky@4.3.7',
            'lint-staged',
            'parcel',
            'prettier',
            'typescript',
        ]);
    }

    end() {
        this.spawnCommandSync('git', ['add', '.'], { cwd: this.destinationPath() });
        this.spawnCommandSync('git', ['commit', '-m', 'Initialize boilerplate using @baltpeter/generator-ts'], {
            cwd: this.destinationPath(),
        });
    }
}
